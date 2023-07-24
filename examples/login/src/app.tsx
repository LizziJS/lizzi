import { Body, zzHtmlComponent } from "@lizzi/template";

import "./app.css";
import { Link, Route, RouteAnchor, Router, zzRouter } from "@lizzi/router";
import { zz } from "@lizzi/core";

class Menu extends zzHtmlComponent {
  constructor() {
    super();

    this.append(
      <div class={["flex gap-1"]}>
        <Link to={[]}>home</Link>
        <Link to={["app", "user"]}>user</Link>
        <Link to={["signin"]}>signin</Link>
        <Link to={["123"]}>notdoin</Link>
      </div>
    );
  }
}

class UserMenu extends zzHtmlComponent {
  constructor() {
    super();

    this.append(
      <div class={["flex gap-1"]}>
        <Link to={["1"]} anchor="user">
          user1
        </Link>
        <Link to={["2"]} anchor="user">
          user2
        </Link>
        <Link to={["3"]} anchor="user">
          user3
        </Link>
      </div>
    );
  }
}

const userId = zz.String();

Body(
  <Router>
    <h1>root</h1>
    <RouteAnchor name="home" />
    <Route route={[""]}>
      <h1>home</h1>
      <Menu />
    </Route>

    <Route route={["app", "user"]}>
      <RouteAnchor name="user" />
      <h1>user</h1>
      <Menu />
      <UserMenu />
      <Route route={[userId]}>
        <h2>user {userId}</h2>
      </Route>
    </Route>

    <Route route={["signin"]}>
      <h1>signin</h1>
      <Menu />
    </Route>

    <Route route={["**"]}>
      <h1>Not found</h1>
      <Menu />
    </Route>
  </Router>
);
