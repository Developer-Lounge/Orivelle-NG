import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { SignInPage } from "./pages/auth/SignInPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "product/:slug", Component: ProductPage },
      { path: "auth/signup", Component: SignUpPage },
      { path: "auth/signin", Component: SignInPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
