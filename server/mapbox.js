const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

const keys = require("./keys");

mapboxgl.accessToken = keys.mapboxToken;

var map = new mapboxgl.Map({
  container: "Map",
  style: "mapbox://styles/mapbox/streets-v11"
});
