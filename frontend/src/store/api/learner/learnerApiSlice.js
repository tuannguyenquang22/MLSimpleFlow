import { apiSlice } from "../apiSlice";


export const learnerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        postLearner: builder.mutation({
            query: (data) => ({
                url: `learner`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Learner']
        }),

        getLearners: builder.query({
            query: () => ({
                url: `learner`,
                method: 'GET'
            }),
            providesTags: ['Learner']
        }),

        getLearner: builder.query({
            query: (id) => ({
                url: `learner/${id}`,
                method: 'GET'
            })
        }),

        getTasks: builder.query({
            query: (id) => ({
                url: `learner/task/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => 
                result
                ? [
                    ...result.data.map(({ id }) => ({ type: 'LearnerTask', id })),
                    { type: 'LearnerTask', id: "LIST" }
                ] 
                : [{ type: 'LearnerTask', id: "LIST" }]
        }),

        postTraining: builder.mutation({
            query: (id) => ({
                url: `learner/run/${id}`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, id) => [{ type: 'LearnerTask', id: "LIST" }]
        }),

        deleteLearner: builder.mutation({
            query: (id) => ({
                url: `learner/${id}`,
                method: 'DELETE'
            })
        }),
    })
});

export const { 
    usePostLearnerMutation, 
    useGetLearnersQuery, 
    useGetLearnerQuery, 
    useDeleteLearnerMutation, 
    useGetTasksQuery, 
    usePostTrainingMutation,
} = learnerApiSlice;