import { Router } from "./router";
import { usePixelUpdates } from "./hooks/usePixelUpdates";

const App = () => {
  usePixelUpdates();

  return (
    <section className="App">
      <Router />
    </section>
  );
};

export default App;
