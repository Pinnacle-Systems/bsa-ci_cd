package com.bsa
import com.bsa.InsurancePolicy
data class ApiResponse(
    val statusCode: Int,
    val data: List<InsurancePolicy>
)