import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Header } from "../components/Header/Header";
import { Pixel } from "../components/Pixel/Pixel";
import { Pixels } from "../components/Pixels/Pixels";

const Layout = () => (
  <>
    <Header />
    <main className="app-main" aria-label="Interview workspace">
      <Outlet />
    </main>
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Pixels />,
      },
      {
        path: "pixels",
        element: <Pixels />,
      },
      {
        path: "pixels/:id",
        element: <Pixel />,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
