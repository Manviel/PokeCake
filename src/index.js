import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

import Home from "./pages/Home";
import Splash from "./pages/Splash";

import Context from "./actions/context";
import ProtectedRoute from "./actions/protectedRoute";
import reducer from "./reducers/index";

import "mapbox-gl/dist/mapbox-gl.css";

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true
  }
});

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
});

const App = () => {
  const initial = useContext(Context);

  const [state, dispatch] = useReducer(reducer, initial);

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Context.Provider value={{ state, dispatch }}>
          <Switch>
            <ProtectedRoute exact path="/" component={Home} />
            <Route path="/login" component={Splash} />
          </Switch>
        </Context.Provider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
