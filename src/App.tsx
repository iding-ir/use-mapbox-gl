import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";

import "./App.css";
import { useMapboxGL } from "./hooks/useMapboxGL";

function App() {
  const { map } = useMapboxGL({});

  return <div id="map"></div>;
}

export default App;
