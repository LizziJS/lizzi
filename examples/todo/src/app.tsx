import { zzInt, zzString } from "@lizzi/core";
import { Body, onClick } from "@lizzi/template";
import { Link, Route, Router, zzRouter } from "@lizzi/template/Router";

const AppRouter = new zzRouter({
  url: new zzString(""),
});

function App() {
  const newI = new zzString("");

  return (
    <Router appRouter={AppRouter}>
      <div>
        <div>
          <Link href="/1/asd">1</Link>
        </div>
        <div>
          <Link href="/2">2</Link>
        </div>
        <Route route={["1", newI]}>
          <div>{newI}</div>
        </Route>
        <Route route={["2"]}>
          <div>fuck</div>
        </Route>
      </div>
    </Router>
  );
}

Body(<App />);
