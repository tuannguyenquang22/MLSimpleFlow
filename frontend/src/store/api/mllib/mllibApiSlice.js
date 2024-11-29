import { apiSlice } from "../apiSlice";


export const mllibApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHyperparameters: builder.query({
            query: ({problem, model}) => ({
                url: `mllib/${problem}/${model}`,
                method: 'GET',
            }),
        }),

        getModels: builder.query({
            query: () => ({
                url: `mllib`,
                method: 'GET',
            })
        }),
    }),
});

export const { useGetHyperparametersQuery, useGetModelsQuery } = mllibApiSlice;