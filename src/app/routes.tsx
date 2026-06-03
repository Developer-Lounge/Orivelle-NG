import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { SignInPage } from "./pages/auth/SignInPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AllProductsPage } from "./pages/AllProductsPage";
import { FlashSalesPage } from "./pages/FlashSalesPage";
import { NewArrivalsPage } from "./pages/NewArrivalsPage";
import { HelpCenterPage } from "./pages/HelpCenterPage";
import { TrackOrderPage } from "./pages/TrackOrderPage";
import { ReturnsPage } from "./pages/ReturnsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "product/:slug", Component: ProductPage },
      { path: "products", Component: AllProductsPage },
      { path: "flash-sales", Component: FlashSalesPage },
      { path: "new-arrivals", Component: NewArrivalsPage },
      { path: "help-center", Component: HelpCenterPage },
      { path: "track-order", Component: TrackOrderPage },
      { path: "returns", Component: ReturnsPage },
      { path: "auth/signup", Component: SignUpPage },
      { path: "auth/signin", Component: SignInPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
