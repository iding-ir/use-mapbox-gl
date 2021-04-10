import { useState, useEffect } from "react";
import mapboxgl, { Map } from "mapbox-gl";

import { extend } from "../utils/extend.js";
import { iOptions } from "./iOptions";
import { Options } from "./Options.d";
import { loadIcons } from "../modules/loadIcons";
import { build } from "../modules/build";
import { fetchGeoJson } from "../modules/fetchGeoJson";
import { renderGeoJson } from "../modules/renderGeoJson";

export const useMapboxGL = (uOptions: Partial<Options>) => {
  const options = extend(true, iOptions, uOptions) as Options;

  const [map, setMap] = useState<Map>();

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

    build(map, options).then(() => {
      loadIcons(map, options).then(() => {
        fetchGeoJson(map, options).then((geoJsons) => {
          renderGeoJson(map, options, geoJsons).then(() => {
            setMap(map);
          });
        });
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { map };
};
