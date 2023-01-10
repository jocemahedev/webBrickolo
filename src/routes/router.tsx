import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import ErrorPage from "../components/pages/ErrorPage";
import CollectionListPage from "../components/pages/CollectionListPage";
import PartsListPage from "../components/pages/PartsListPage";
import MissingPartsListPage from "../components/pages/MissingPartsListPage";
import SearchSetPage from "../components/pages/SearchSetPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <CollectionListPage />,
      },
      {
        path: "parts-list",
        element: <PartsListPage />,
      },
      {
        path: "search-set",
        element: <SearchSetPage />,
      },
      {
        path: "missing-parts-list",
        element: <MissingPartsListPage />,
      },
    ],
  },
]);
