let counter = Math.floor(Math.random() * 1000);

export function generateUniqueId_Number() {
  const timestamp = Date.now(); // 13-digit millisecond timestamp
  counter = (counter + 1) % 1000; // Rotating counter to guarantee uniqueness within the same ms
  // Append 3 digits. Resulting 16-digit number fits within Number.MAX_SAFE_INTEGER
  return Number(`${timestamp}${String(counter).padStart(3, "0")}`);
}
