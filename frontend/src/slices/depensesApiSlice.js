import { DEPENSES_URL } from "../constants";
import { apiSlice } from "./apiSlices";

export const depensesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepenses: builder.query({
      query: () => ({
        url: DEPENSES_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getDepenseDetails: builder.query({
      query: (expenseId) => ({
        url: `${DEPENSES_URL}/${expenseId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createDepense: builder.mutation({
      query: (data) => ({
        url: DEPENSES_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Depense"],
    }),
    updateDepense: builder.mutation({
      query: (data) => ({
        url: `${DEPENSES_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Depense"],
    }),
    deleteDepense: builder.mutation({
      query: (expenseId) => ({
        url: `${DEPENSES_URL}/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Depense"],
    }),
  }),
});

export const {
  useGetDepensesQuery,
  useCreateDepenseMutation,
  useGetDepenseDetailsQuery,
  useUpdateDepenseMutation,
  useDeleteDepenseMutation,
} = depensesApiSlice;
