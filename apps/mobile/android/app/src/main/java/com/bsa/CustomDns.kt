package com.bsa

import android.util.Log
import okhttp3.Dns
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.HttpURLConnection
import java.net.InetAddress
import java.net.URL
import java.net.UnknownHostException
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.TimeUnit
import kotlin.random.Random

/**
 * CustomDns — Stable DNS for 3G / 4G / 5G / WiFi
 *
 * ✅ Cache → Race (System + Google + Cloudflare simultaneously) → DoH port 443
 * ✅ Fastest responder wins — no waiting for slow carrier DNS
 */
class CustomDns : Dns {

    companion object {
        private const val TAG = "CustomDns"

        // Cache TTL: 5 minutes
        private const val CACHE_TTL_MS = 60_000L 

        // How long to wait for ANY DNS to respond
        private const val RACE_TIMEOUT_MS = 2000L

        // DoH timeout (slightly longer — HTTPS handshake needed)
        private const val DOH_TIMEOUT_MS = 3000

        // Google and Cloudflare UDP DNS servers (port 53)
        private val UDP_DNS_SERVERS = listOf(
            "8.8.8.8",   // Google Primary
            "1.1.1.1",   // Cloudflare Primary
            "8.8.4.4",   // Google Secondary
            "1.0.0.1"    // Cloudflare Secondary
        )

        // DNS-over-HTTPS fallback (port 443 — never blocked)
        private val DOH_SERVERS = listOf(
            "https://dns.google/resolve",
            "https://cloudflare-dns.com/dns-query"
        )

        // In-memory cache
        private val cache = ConcurrentHashMap<String, Pair<List<InetAddress>, Long>>()

        // Thread pool: System + 4 UDP + buffer = 6 threads enough
        private val executor = Executors.newFixedThreadPool(6)
    }

    override fun lookup(hostname: String): List<InetAddress> {

        // ── Layer 1: Cache ──────────────────────────────────────────
        cache[hostname]?.let { (addresses, timestamp) ->
            if (System.currentTimeMillis() - timestamp < CACHE_TTL_MS) {
                Log.d(TAG, "[$hostname] Cache hit")
                return addresses
            }
            cache.remove(hostname)
        }

        // ── Layer 2: Race System DNS + All UDP DNS simultaneously ───
        // ✅ 3G/4G/5G carrier DNS may be slow — race everyone at once
        // ✅ Fastest responder wins immediately
        val result = raceAllDns(hostname)
        if (result.isNotEmpty()) return result

        // ── Layer 3: DNS-over-HTTPS port 443 (final fallback) ───────
        // ✅ Works even when UDP port 53 is blocked
        Log.w(TAG, "[$hostname] All UDP failed → trying DoH")
        val doh = dnsOverHttps(hostname)
        if (doh.isNotEmpty()) return doh

        // ── Layer 4: Hardcoded Fallback IP ──────────────────────────
        // ✅ Final fallback when all DNS queries fail
        Log.e(TAG, "[$hostname] All DNS layers failed → using hardcoded fallback IP")
        return listOf(InetAddress.getByName("193.203.160.198"))
    }

    // ────────────────────────────────────────────────────────────────
    // Race: System DNS + Google + Cloudflare all at same time
    // First valid response wins — losers are cancelled
    // ────────────────────────────────────────────────────────────────
    private fun raceAllDns(hostname: String): List<InetAddress> {

        val futures = mutableListOf<Future<List<InetAddress>>>()

        // Submit System DNS
        futures.add(executor.submit<List<InetAddress>> {
            try {
                val r = Dns.SYSTEM.lookup(hostname)
                Log.d(TAG, "[$hostname] System DNS responded")
                r
            } catch (e: Exception) {
                emptyList()
            }
        })

        // Submit all UDP DNS servers in parallel
        UDP_DNS_SERVERS.forEach { server ->
            futures.add(executor.submit<List<InetAddress>> {
                try {
                    val r = queryUdpDns(hostname, server)
                    if (r.isNotEmpty()) Log.d(TAG, "[$hostname] UDP $server responded")
                    r
                } catch (e: Exception) {
                    emptyList()
                }
            })
        }

        val deadline = System.currentTimeMillis() + RACE_TIMEOUT_MS

        for (future in futures) {
            val remaining = deadline - System.currentTimeMillis()
            if (remaining <= 0) break
            try {
                val result = future.get(remaining, TimeUnit.MILLISECONDS)
                if (result.isNotEmpty()) {
                    // ✅ Winner found — cancel all others immediately
                    futures.forEach { it.cancel(true) }
                    cacheResult(hostname, result)
                    return result
                }
            } catch (e: Exception) {
                // This future lost — try next
            }
        }

        futures.forEach { it.cancel(true) }
        return emptyList()
    }

    // ────────────────────────────────────────────────────────────────
    // DNS-over-HTTPS — port 443, works on all networks
    // Used only when ALL UDP DNS servers fail
    // ────────────────────────────────────────────────────────────────
    private fun dnsOverHttps(hostname: String): List<InetAddress> {
        for (server in DOH_SERVERS) {
            try {
                val conn = URL("$server?name=$hostname&type=A")
                    .openConnection() as HttpURLConnection
                conn.apply {
                    connectTimeout = DOH_TIMEOUT_MS
                    readTimeout    = DOH_TIMEOUT_MS
                    setRequestProperty("Accept", "application/dns-json")
                }

                val response = conn.inputStream.bufferedReader().readText()
                conn.disconnect()

                val ips = Regex(""""data"\s*:\s*"([\d.]+)"""")
                    .findAll(response)
                    .map { it.groupValues[1] }
                    .filter { isValidIPv4(it) }
                    .map { InetAddress.getByName(it) }
                    .toList()

                if (ips.isNotEmpty()) {
                    cacheResult(hostname, ips)
                    Log.d(TAG, "[$hostname] DoH OK via $server")
                    return ips
                }
            } catch (e: Exception) {
                Log.w(TAG, "[$hostname] DoH failed [$server]: ${e.message}")
            }
        }
        return emptyList()
    }

    // ────────────────────────────────────────────────────────────────
    // Send raw UDP DNS query to specific server on port 53
    // ────────────────────────────────────────────────────────────────
    private fun queryUdpDns(hostname: String, serverIp: String): List<InetAddress> {
        DatagramSocket().use { socket ->
            socket.soTimeout = RACE_TIMEOUT_MS.toInt()
            val query = buildDnsQuery(hostname)
            socket.send(
                DatagramPacket(query, query.size, InetAddress.getByName(serverIp), 53)
            )
            val buf      = ByteArray(512)
            val response = DatagramPacket(buf, buf.size)
            socket.receive(response)
            return parseDnsARecords(response.data, response.length)
        }
    }

    // ────────────────────────────────────────────────────────────────
    // Build minimal DNS A-record query packet
    // ────────────────────────────────────────────────────────────────
    private fun buildDnsQuery(hostname: String): ByteArray {
        val out  = mutableListOf<Byte>()
        val txId = Random.nextInt(0xFFFF)

        out += listOf(
            (txId shr 8).toByte(), (txId and 0xFF).toByte(),
            0x01, 0x00,
            0x00, 0x01,
            0x00, 0x00,
            0x00, 0x00,
            0x00, 0x00
        )

        hostname.split(".").forEach { label ->
            out.add(label.length.toByte())
            label.forEach { out.add(it.code.toByte()) }
        }
        out.add(0x00)
        out += listOf(0x00, 0x01) // QTYPE: A
        out += listOf(0x00, 0x01) // QCLASS: IN

        return out.toByteArray()
    }

    // ────────────────────────────────────────────────────────────────
    // Parse DNS response — extract A (IPv4) records only
    // ────────────────────────────────────────────────────────────────
    private fun parseDnsARecords(data: ByteArray, length: Int): List<InetAddress> {
        val addresses = mutableListOf<InetAddress>()
        try {
            val answerCount = ((data[6].toInt() and 0xFF) shl 8) or (data[7].toInt() and 0xFF)
            if (answerCount == 0) return addresses

            var pos = 12

            while (pos < length) {
                val len = data[pos].toInt() and 0xFF
                if (len == 0) { pos++; break }
                if ((len and 0xC0) == 0xC0) { pos += 2; break }
                pos += len + 1
            }
            pos += 4

            repeat(answerCount) {
                if (pos >= length) return@repeat

                if ((data[pos].toInt() and 0xFF) == 0xC0) {
                    pos += 2
                } else {
                    while (pos < length) {
                        val l = data[pos].toInt() and 0xFF
                        if (l == 0) { pos++; break }
                        pos += l + 1
                    }
                }

                if (pos + 10 > length) return@repeat

                val type  = ((data[pos].toInt() and 0xFF) shl 8) or (data[pos + 1].toInt() and 0xFF)
                pos += 2
                pos += 2
                pos += 4
                val rdLen = ((data[pos].toInt() and 0xFF) shl 8) or (data[pos + 1].toInt() and 0xFF)
                pos += 2

                if (type == 1 && rdLen == 4 && pos + 4 <= length) {
                    addresses.add(InetAddress.getByAddress(data.copyOfRange(pos, pos + 4)))
                }
                pos += rdLen
            }
        } catch (e: Exception) {
            Log.w(TAG, "DNS parse error: ${e.message}")
        }
        return addresses
    }

    // ────────────────────────────────────────────────────────────────
    // Helpers
    // ────────────────────────────────────────────────────────────────
    private fun cacheResult(hostname: String, addresses: List<InetAddress>) {
        cache[hostname] = Pair(addresses, System.currentTimeMillis())
    }

    private fun isValidIPv4(ip: String): Boolean =
        ip.matches(Regex("""\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"""))

    /** Call from NetworkCallback when network changes */
    fun clearCache() {
        cache.clear()
        Log.d(TAG, "DNS cache cleared")
    }
}
