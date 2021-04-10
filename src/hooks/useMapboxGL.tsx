import { useState, useEffect } from "react";
import mapboxgl, { Map } from "mapbox-gl";

import { extend } from "../utils/extend.js";
import { iOptions } from "./iOptions";
import { IOptions } from "./IOptions.d";

export const useMapboxGL = (opts: any) => {
  const options = extend(true, iOptions, opts) as IOptions;

  const [map, setMap] = useState<Map>();
  const [build, setBuild] = useState<Promise<unknown>>();

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN as string;

    const map: Map = new mapboxgl.Map({
      container: options.map.container,
      center: options.map.center,
      zoom: options.map.zoom,
      minZoom: options.map.minZoom,
      maxZoom: options.map.maxZoom,
      pitch: options.map.pitch,
      bearing: options.map.bearing,
      hash: options.map.hash,
      style: options.styles[options.defaultStyle],
    });

    if (options.controls.fullscreen) {
      const fullscreenControl = new mapboxgl.FullscreenControl({});

      map.addControl(fullscreenControl, "top-right");
    }

    if (options.controls.geolocation) {
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: false,
      });

      map.addControl(geolocateControl, "bottom-right");
    }

    if (options.controls.navigation) {
      const navigationControl = new mapboxgl.NavigationControl({});

      map.addControl(navigationControl, "top-right");
    }

    const build = new Promise((resolve, reject) => {
      map.on("style.load", () => {
        if (map.getLayer("background")) {
          map.setPaintProperty(
            "background",
            "background-color",
            options.mapColors[options.defaultStyle].background
          );
        }

        if (map.getLayer("country-fills")) {
          map.setPaintProperty(
            "country-fills",
            "fill-color",
            options.mapColors[options.defaultStyle].fill
          );
        }

        if (map.getLayer("country-lines")) {
          map.setPaintProperty(
            "country-lines",
            "line-color",
            options.mapColors[options.defaultStyle].line
          );
        }

        if (map.getLayer("country-symbols")) {
          map.setPaintProperty(
            "country-symbols",
            "text-color",
            options.mapColors[options.defaultStyle].text
          );
        }
      });

      map.on("load", () => {
        resolve(true);
      });
    });

    setMap(map);
    setBuild(build);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { map, build };
};
