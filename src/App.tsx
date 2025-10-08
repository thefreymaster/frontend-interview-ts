import "./App.css";

import { api } from "./api/api";
import { Header } from "./components/Header/Header";
import { Vendor } from "./components/Vendor/Vendor";
import { IVendor } from "./interfaces/vendors";

const App = () => {
  return (
    <section className="App">
      <Header />
    </section>
  );
};

export default App;
