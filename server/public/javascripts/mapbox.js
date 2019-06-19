mapboxgl.accessToken =
  "pk.eyJ1IjoibWFudmllbCIsImEiOiJjangyeGNucjAwbmRoM3lwNGZuZmo4MHZjIn0.dTswZszMc6pNhWqEdW4VWg";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  center: post.coordinates,
  zoom: 5
});

const marker = document.createElement("div");
marker.className = "marker";

new mapboxgl.Marker(marker)
  .setLngLat(post.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${post.title}</h3><p>${post.location}</p>`
    )
  )
  .addTo(map);
