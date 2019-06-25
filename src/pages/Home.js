import React, { useContext } from "react";
import { Subscription } from "react-apollo";

import Map from "../components/Map";
import Header from "../components/Header";
import Blog from "../components/Blog";

import Context from "../actions/context";

import { PIN_ADDED, PIN_UPDATED, PIN_DELETED } from "../graphql/subscriptions";

import "../css/Style.css";
import "../css/App.css";

const Home = () => {
  const { dispatch } = useContext(Context);

  return (
    <article className="container">
      <Header title="Explore | Move | Connect" />
      <section className="content">
        <Map />
        <Subscription
          subscription={PIN_ADDED}
          onSubscriptionData={({ subscriptionData }) => {
            const { pinAdded } = subscriptionData.data;

            dispatch({ type: "CREATE_PIN", payload: pinAdded });
          }}
        />
        <Subscription
          subscription={PIN_UPDATED}
          onSubscriptionData={({ subscriptionData }) => {
            const { pinUpdated } = subscriptionData.data;

            dispatch({ type: "CREATE_COMMENT", payload: pinUpdated });
          }}
        />
        <Subscription
          subscription={PIN_DELETED}
          onSubscriptionData={({ subscriptionData }) => {
            const { pinDeleted } = subscriptionData.data;

            dispatch({ type: "DELETE_PIN", payload: pinDeleted });
          }}
        />
        <Blog />
      </section>
    </article>
  );
};

export default Home;
