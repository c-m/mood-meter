import React from "react";
import Router from "react-router";
let { Route, RouteHandler, NotFoundRoute, DefaultRoute, Link } = Router;


// Components

import Mood from "./components/mood";
import Stats from "./components/stats";
import Navigation from "./components/navigation";
import SetMood from "./components/setmood";

// API URL's constants

window.API_URL = window.location.origin + "/api";
window.STATUSES = window.API_URL + "/statuses/";
window.TIMESERIES = window.API_URL + "/timeseries/";

import "./../styles/main.less";

let StressedApp = React.createClass({
  displayName: "StressedApp",

  render() {
    return <div className="stressed-app">
      <div className="stressed-wrapper">
        <RouteHandler />
        <Navigation />
      </div>
    </div>
  }
});

let routes = (
  <Route handler={StressedApp} path="/">
    <Route handler={Mood} name="mood" path="/mood" />
    <Route handler={Stats} name="stats" path="/stats" />
    <Route handler={SetMood} name="setmood" path="/setmood" />
    <NotFoundRoute handler={Mood}/>
    <DefaultRoute handler={Mood} pageTitle="Home"/>
  </Route>
);


Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('root'));
});
