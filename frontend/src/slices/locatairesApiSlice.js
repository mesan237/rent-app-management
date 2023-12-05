import { LOCATAIRES_URL } from "../constants";
import { apiSlice } from "./apiSlices";

export const locaTairesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocataires: builder.query({
      query: () => ({
        url: LOCATAIRES_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getLocataireDetails: builder.query({
      query: (tenantId) => ({
        url: `${LOCATAIRES_URL}/${tenantId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createLocataire: builder.mutation({
      query: (data) => ({
        url: LOCATAIRES_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Locataire"],
    }),
    updateLocataire: builder.mutation({
      query: (data) => ({
        url: `${LOCATAIRES_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Locataire"],
    }),
    deleteLocataire: builder.mutation({
      query: (tenantId) => ({
        url: `${LOCATAIRES_URL}/${tenantId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Locataire"],
    }),
  }),
});

export const {
  useGetLocatairesQuery,
  useCreateLocataireMutation,
  useUpdateLocataireMutation,
  useGetLocataireDetailsQuery,
  useDeleteLocataireMutation,
} = locaTairesApiSlice;
