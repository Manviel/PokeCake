import React, { useState } from "react";
import ReactMapGL from "react-map-gl";

import { MAPBOX_TOKEN } from "../config";

const view = {
  latitude: 37.773972,
  longitude: -122.431297,
  zoom: 13
};

const Map = () => {
  const [viewport, setViewport] = useState(view);

  return (
    <ReactMapGL
      width="100"
      height="calc(100vh - 64px)"
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onViewportChange={newView => setViewport(newView)}
      {...viewport}
    />
  );
};

export default Map;
