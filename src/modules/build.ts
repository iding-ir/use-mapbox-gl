import mapboxgl, { Map } from "mapbox-gl";
import { Options } from "../hooks/Options.d";

export const build = (map: Map, options: Options) => {
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

  return new Promise<void>((resolve, reject) => {
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
      resolve();
    });
  });
};
