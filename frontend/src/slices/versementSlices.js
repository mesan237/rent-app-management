import { VERSEMENTS_URL } from "../constants";
import { apiSlice } from "./apiSlices";

export const versementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVersements: builder.query({
      query: () => ({
        url: VERSEMENTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getVersementDetails: builder.query({
      query: (versementId) => ({
        url: `${VERSEMENTS_URL}/${versementId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createVersement: builder.mutation({
      query: (data) => ({
        url: VERSEMENTS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Versement"],
    }),
    updateVersement: builder.mutation({
      query: (data) => ({
        url: `${VERSEMENTS_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Versement"],
    }),
  }),
});

export const {
  useGetVersementsQuery,
  useGetVersementDetailsQuery,
  useUpdateVersementMutation,
  useCreateVersementMutation,
} = versementsApiSlice;
