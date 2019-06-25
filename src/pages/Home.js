import React from "react";

import Map from "../components/Map";
import Header from "../components/Header";
import Blog from "../components/Blog";

import "../css/Style.css";
import "../css/App.css";

const Home = () => {
  return (
    <article className="container">
      <Header title="Explore | Move | Connect" />
      <section className="content">
        <Map />
        <Blog />
      </section>
    </article>
  );
};

export default Home;
