import ReactDOM from "react-dom/client";
import React, { Suspense } from "react";

import "./index.css";
import ProductDetail from "./ProductDetail";
import ProductHeader from "./ProductHeader";

// Import shared styles from home microfrontend
import "home/styles";

// Import shared Footer from home microfrontend
const Footer = React.lazy(() => import("home/Footer"));

const App = () => (
  <div className="min-h-screen flex flex-col">
    <ProductHeader />

    <main className="flex-1 bg-gray-50">
      <ProductDetail />
    </main>

    <Suspense fallback={<div className="h-32 bg-black"></div>}>
      <Footer />
    </Suspense>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);
