import ReactDOM from "react-dom/client";
import React, { Suspense } from "react";

import "./index.css";

// Import shared components from home microfrontend
const Header = React.lazy(() => import("home/Header"));
const Footer = React.lazy(() => import("home/Footer"));

const App = () => (
  <div className="min-h-screen flex flex-col">
    <Suspense fallback={<div className="h-16 bg-black"></div>}>
      <Header />
    </Suspense>

    <main className="flex-1 bg-gray-100">
      <div className="mt-10 text-3xl mx-auto max-w-6xl p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Product Catalog
          </h1>
          <div className="text-lg text-gray-600 mb-2">Name: product</div>
          <div className="text-lg text-gray-600 mb-4">Framework: react-19</div>
          <p className="text-gray-700">
            This is the product microfrontend sharing the Header and Footer
            components from the home microfrontend using Module Federation! 🏎️
          </p>
        </div>
      </div>
    </main>

    <Suspense fallback={<div className="h-32 bg-black"></div>}>
      <Footer />
    </Suspense>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);
