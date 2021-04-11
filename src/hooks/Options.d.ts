import { LngLatLike } from "mapbox-gl";

export interface Options {
  map: IMap;
  controls: IControls;
  featureColors: {
    dark: IColors;
    light: IColors;
  };
  mapColors: {
    dark: ImapColors;
    light: ImapColors;
  };
  styles: {
    light: string;
    dark: string;
  };
  defaultStyle: "light" | "dark";
  icons: {
    [key: string]: string;
  };
  defaultIcon: string;
  geoJsons: {
    [key: string]: string;
  };
  layers: {
    polygon: {
      fill: boolean;
      line: boolean;
    };
    polyline: {
      line: boolean;
      symbol: boolean;
    };
    point: {
      symbol: boolean;
    };
  };
  sourcePrefix: string;
  layersPrefixes: {
    polygon: {
      fill: string;
      line: string;
    };
    polyline: {
      line: string;
      symbol: string;
    };
    point: {
      symbol: string;
    };
  };
}

export interface IMap {
  container: string;
  center: LngLatLike;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  pitch: number;
  bearing: number;
  hash: boolean;
}

export interface IControls {
  fullscreen: boolean;
  geolocation: boolean;
  navigation: boolean;
}

export interface IColors {
  primary: string;
  secondary: string;
}

export interface ImapColors {
  background: string;
  fill: string;
  line: string;
  text: string;
}
