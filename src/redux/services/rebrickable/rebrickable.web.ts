// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RebrickablePart, RebrickableSet } from "./type";
import { addParts } from "../../set";

const key = import.meta.env.VITE_REBRICKABLE_API_KEY;

export const rebrickableApi = createApi({
  reducerPath: "rebrickableApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rebrickable.com/api/v3/lego/",
  }),
  endpoints: (builder) => ({
    getSetByIdLego: builder.query<RebrickableSet, string>({
      query: (idLego) => "sets/" + idLego + "?page_size=1000&key=" + key,
    }),
    getPartsByIdLego: builder.query<RebrickablePart[], string>({
      query: (idLego) =>
        "sets/" +
        idLego +
        "/parts?inc_minifig_parts=1&page_size=1000&key=" +
        key,
      transformResponse: (response: any) => response.results,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          dispatch(addParts(response.data));
        } catch (err) {
          console.log("getParts BAD");
        }
      },
    }),
  }),
});

export const { useGetSetByIdLegoQuery, useGetPartsByIdLegoQuery } =
  rebrickableApi;
