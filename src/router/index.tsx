import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Header } from "../components/Header/Header";
import { Merchant } from "../components/Merchant/Merchant";
import { MerchantsList } from "../components/MerchantsList/MerchantsList";

const Layout = () => (
  <>
    <Header />
    <section style={{ padding: "1rem" }}>
      <Outlet />
    </section>
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MerchantsList />,
      },
      {
        path: "/:merchant_id",
        element: <Merchant />,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
