import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";

import "./App.css";
import { useMapboxGL } from "./hooks/useMapboxGL";

function App() {
  const { map } = useMapboxGL({
    icons: {
      cat: "/assets/images/icon-cat.png",
      dog: "/assets/images/icon-dog.png",
    },
    geoJsons: {
      cats: "/data/cats.json",
      dogs: "/data/dogs.json",
      ways: "/data/ways.json",
    },
  });

  console.log(map);

  return <div id="map"></div>;
}

export default App;
