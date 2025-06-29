import ReactDOM from "react-dom/client";

import "./index.css";
import Header from "./Header";
import Footer from "./Footer";
import ProductGrid from "./ProductGrid";

const App = () => (
  <div className="min-h-screen flex flex-col">
    <Header />

    <main className="flex-1 bg-gray-50">
      <ProductGrid />
    </main>

    <Footer />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);
