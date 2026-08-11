import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SUPPLIER, BASE_URL } from "@Constants/apiUrl";
import { SetHeader } from "@Redux/service/HeaderSet";


const supplier = createApi({
    reducerPath: 'supplier',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: async (headers) => {
            await SetHeader(headers);
            return headers;
        },
    }),
    tagTypes: ['Supplier'],
    endpoints: (builder) => ({
        getSupplier: builder.query({
            query: () => {
                return {
                    url: SUPPLIER,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            },
            providesTags: ['Supplier'],
        }),

    }),
})

export const {
    useGetSupplierQuery,
} = supplier;

export default supplier;