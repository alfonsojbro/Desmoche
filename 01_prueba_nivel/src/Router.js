import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import About from "./About";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Game from "./Game";
import { withRouter } from "react-router";
export default function Router() {
  const HeaderWithRouter = withRouter(Navbar);
  return (
    <BrowserRouter>
      <HeaderWithRouter></HeaderWithRouter>
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/juego" component={Game} />
        <Route path="/" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}
