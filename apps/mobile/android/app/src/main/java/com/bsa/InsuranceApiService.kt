// InsuranceApiService.kt in com.bsa.network package
package com.bsa

import com.bsa.ApiResponse
import retrofit2.http.GET
import retrofit2.http.Headers

interface InsuranceApiService {

    @Headers("COMPCODE: bsa")
    @GET("misDashboard/getInsuranceDataAlert")
    suspend fun getInsurancePolicies(): ApiResponse
}