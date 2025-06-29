import ReactDOM from "react-dom/client";

import "./index.css";
import Header from "./Header";
import Footer from "./Footer";

const App = () => (
  <>
    <Header />
    <Footer />
  </>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);
