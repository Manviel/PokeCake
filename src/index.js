import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Splash from "./pages/Splash";

import Context from "./actions/context";
import ProtectedRoute from "./actions/protectedRoute";
import reducer from "./reducers/index";

import "mapbox-gl/dist/mapbox-gl.css";

const App = () => {
  const initial = useContext(Context);

  const [state, dispatch] = useReducer(reducer, initial);

  return (
    <BrowserRouter>
      <Context.Provider value={{ state, dispatch }}>
        <Switch>
          <ProtectedRoute exact path="/" component={Home} />
          <Route path="/login" component={Splash} />
        </Switch>
      </Context.Provider>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
