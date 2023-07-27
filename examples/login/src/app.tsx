import { Body, zzHtmlComponent, JSX } from "@lizzi/template";

import "./app.css";
import { Link, RouteAnchor, Route, Router } from "@lizzi/router";
import { zz } from "@lizzi/core";
import { Fragment } from "@lizzi/jsx-runtime";

class Menu extends Fragment {}

class Tab extends Fragment {
  static Menu = Menu;
}

class HomeMenu extends zzHtmlComponent {
  constructor({ children }: JSX.PropsWithChildren) {
    super();

    const menus = <>{children}</>;

    const tabs = menus
      .flatChildInstances(Tab)
      .map((tab) => tab.firstChild(Tab.Menu));

    this.append(
      <>
        <div class={["flex gap-1"]}>Tabs</div>
        {tabs}
        <div class={["flex gap-1"]}>Content</div>
        {menus}
      </>
    );
  }
}

const userId = zz.String();

Body(
  <Router>
    <h1>root</h1>
    <RouteAnchor name="home" />
    <HomeMenu>
      <Tab>
        <Tab.Menu>
          <Link to={[]}>-1</Link>
        </Tab.Menu>
        <Route route={[]}>
          <h1>home</h1>
        </Route>
      </Tab>
      <Tab>
        <Route route={[]}>
          <h1>home</h1>
        </Route>
      </Tab>
      <Tab>
        <Tab.Menu>
          <Link to={["home"]}>-2</Link>
        </Tab.Menu>
        <Route route={["home"]}>
          <h1>home-2</h1>
        </Route>
      </Tab>
      <Tab>
        <Tab.Menu>
          <Link to={["signup"]}>-3</Link>
        </Tab.Menu>
        <Route route={["signup"]}>
          <h1>signup</h1>
        </Route>
      </Tab>
    </HomeMenu>
  </Router>
);
