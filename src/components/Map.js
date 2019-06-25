import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

import Context from "../actions/context";
import { useClient } from "../actions/client";

import { GET_PINS_QUERY } from "../graphql/queries";

import { MAPBOX_TOKEN } from "../config";

const view = {
  latitude: 37.773972,
  longitude: -122.431297,
  zoom: 13
};

const Map = () => {
  const [viewport, setViewport] = useState(view);
  const [userPosition, setUserPosition] = useState(null);

  const client = useClient();

  const { dispatch, state } = useContext(Context);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  }, [viewport]);

  useEffect(() => {
    getPins();
  });

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);

    dispatch({ type: "GET_PINS", payload: getPins });
  };

  const handleClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }

    const [longitude, latitude] = lngLat;

    dispatch({
      type: "UPDATE_DRAFT",
      payload: { longitude, latitude }
    });
  };

  return (
    <ReactMapGL
      width="100"
      height="calc(100vh - 84px)"
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onViewportChange={newView => setViewport(newView)}
      onClick={handleClick}
      {...viewport}
    >
      {userPosition && (
        <Marker
          latitude={userPosition.latitude}
          longitude={userPosition.longitude}
          offsetLeft={-19}
          offsetTop={-37}
        >
          <div className="marker blue" />
        </Marker>
      )}
      {state.draft && (
        <Marker
          latitude={state.draft.latitude}
          longitude={state.draft.longitude}
          offsetLeft={-19}
          offsetTop={-10}
        >
          <div className="marker red" />
        </Marker>
      )}
      {state.pins.map(pin => (
        <Marker
          key={pin._id}
          latitude={pin.latitude}
          longitude={pin.longitude}
          offsetLeft={-19}
          offsetTop={-37}
        >
          <div className="marker purple" />
        </Marker>
      ))}
    </ReactMapGL>
  );
};

export default Map;
