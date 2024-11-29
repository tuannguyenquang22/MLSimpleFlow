import { apiSlice } from "../apiSlice";


export const dataSourceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        postDataSource: builder.mutation({
            query: (data) => ({
                url: "datasource",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["DataSource"],
        }),
        getDataSources: builder.query({
            query: () => ({
                url: "datasource",
                method: "GET",
            }),
            providesTags: ["DataSource"],
        }),
        getDataSource: builder.query({
            query: (id) => ({
                url: `datasource/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "DataSource", id: id }],
        }),
    })
});

export const { usePostDataSourceMutation, useGetDataSourceQuery, useGetDataSourcesQuery } = dataSourceApi;