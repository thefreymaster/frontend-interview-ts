import "./App.css";

import { api } from "./api/api";
import { Header } from "./components/Header/Header";
import { Vendors } from "./components/Vendors/Vendors";
import { IVendor } from "./interfaces/vendors";

const App = () => {
  return (
    <section className="App">
      <Header />
      <Vendors />
    </section>
  );
};

export default App;
