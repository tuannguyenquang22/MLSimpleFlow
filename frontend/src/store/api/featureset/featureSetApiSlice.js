import { apiSlice } from "../apiSlice";


export const featureSetApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        postProfiling: builder.mutation({
            query: (data) => ({
                url: `featureset/profiling`,
                method: 'POST',
                body: data
            })
        }),

        postFeatureSet: builder.mutation({
            query: (data) => ({
                url: `featureset`,
                method: 'POST',
                body: data
            })
        }),

        getFeatureSets: builder.query({
            query: () => ({
                url: `featureset`,
                method: 'GET'
            })
        }),

        deleteFeatureSet: builder.mutation({
            query: (id) => ({
                url: `featureset/${id}`,
                method: 'DELETE'
            })
        }),

    })
});

export const { usePostProfilingMutation, usePostFeatureSetMutation, useGetFeatureSetsQuery, useDeleteFeatureSetMutation } = featureSetApiSlice;