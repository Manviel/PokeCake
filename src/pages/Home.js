import React from "react";

import Map from "../components/Map";
import Header from "../components/Header";

import "../css/Style.css";
import "../css/App.css";

const Home = () => {
  return (
    <article className="container">
      <Header title="Explore | Move | Connect" />
      <section className="content">
        <Map />
      </section>
    </article>
  );
};

export default Home;
