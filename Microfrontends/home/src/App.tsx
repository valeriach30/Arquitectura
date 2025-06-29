import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import Header from "./Header";
import Footer from "./Footer";
import ProductGrid from "./ProductGrid";
import CartPage from "./CartPage";

const App = () => (
  <Router>
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<ProductGrid />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);
