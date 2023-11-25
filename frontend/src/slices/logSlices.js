import { LOGS_URL } from "../constants.js";
import { apiSlice } from "./apiSlices.js";

export const logsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    log: builder.query({
      query: () => ({
        url: LOGS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useLogQuery } = logsApiSlice;
