import { Options } from "./Options.d";

export const iOptions: Options = {
  map: {
    container: "map",
    center: [35, 35],
    zoom: 2,
    minZoom: 2,
    maxZoom: 20,
    pitch: 0,
    bearing: 0,
    hash: false,
  },
  controls: {
    fullscreen: false,
    geolocation: true,
    navigation: true,
  },
  featureColors: {
    light: {
      primary: "#1976D2",
      secondary: "#8BC34A",
    },
    dark: {
      primary: "#455A64",
      secondary: "#FFA000",
    },
  },
  mapColors: {
    light: {
      background: "#0D47A1",
      fill: "#EFEBE9",
      line: "#3E2723",
      text: "#3E2723",
    },
    dark: {
      background: "#101518",
      fill: "#263238",
      line: "#E1F5FE",
      text: "#E1F5FE",
    },
  },
  styles: {
    light: "/map/jsons/styles/light/style.json",
    dark: "/map/jsons/styles/dark/style.json",
    // light: "mapbox://styles/mapbox/light-v10",
    // dark: "mapbox://styles/mapbox/dark-v10",
  },
  defaultStyle: "light",
  icons: {
    default: "/map/images/icon-default.png",
  },
  defaultIcon: "default",
  geoJsons: {},
  layers: {
    polygon: {
      fill: true,
      line: true,
    },
    polyline: {
      line: true,
      symbol: false,
    },
    point: {
      symbol: true,
    },
  },
  sourcePrefix: "",
  layersPrefixes: {
    polygon: {
      fill: "polygon-fill-",
      line: "polygon-line-",
    },
    polyline: {
      line: "polyline-line-",
      symbol: "polyline-symbol-",
    },
    point: {
      symbol: "point-symbol-",
    },
  },
};
