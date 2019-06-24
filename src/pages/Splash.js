import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import Context from "../actions/context";
import Header from "../components/Header";

const Splash = () => {
  const { state } = useContext(Context);

  return state.isAuth ? (
    <Redirect to="" />
  ) : (
    <section className="container">
      <Header title="Login" />
    </section>
  );
};

export default Splash;
