import { useState, useEffect } from "react";
import mapboxgl, { Map } from "mapbox-gl";

import { extend } from "../utils/extend.js";
import { iOptions } from "./iOptions";
import { IOptions } from "./IOptions.d";

export const useMapboxGL = (opts: any) => {
  const options = extend(true, iOptions, opts) as IOptions;

  const [map, setMap] = useState<Map>();
  const [load, setLoad] = useState<Promise<unknown>>();

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

    const loadIcons = () => {
      return new Promise((resolve, reject) => {
        const promises: { [key: string]: any } = {};

        for (let key in options.icons) {
          const value = options.icons[key];

          promises[key] = new Promise((resolve, reject) => {
            map.loadImage(value, (error, image: any) => {
              if (error) {
                reject(error);
              } else {
                map.addImage(key, image);

                resolve(true);
              }
            });
          });
        }

        Promise.all(Object.values(promises))
          .then(() => {
            resolve(true);
          })
          .catch((error: Error) => {
            reject(error);
          });
      });
    };

    const build = () => {
      return new Promise((resolve, reject) => {
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
    };

    const fetchGeoJson = () => {
      return new Promise((resolve, reject) => {
        const promises: { [key: string]: any } = {};
        const geoJsons: { [key: string]: any } = {};

        for (let key in options.geoJsons) {
          const value = options.geoJsons[key];

          promises[key] = new Promise((resolve, reject) => {
            fetch(value)
              .then((response) => response.json())
              .then((json) => {
                geoJsons[key] = json;

                geoJsons[key] = json;

                resolve(true);
              })
              .catch((error) => {
                reject(error);
              });
          });
        }

        Promise.all(Object.values(promises))
          .then(() => {
            resolve(geoJsons);
          })
          .catch((error: Error) => {
            reject(error);
          });
      });
    };

    const prepareSource = (suffix: string) => {
      const prefix = options.sourcePrefix;
      const source = prefix + suffix;

      if (map.getSource(source)) map.removeSource(source);

      return source;
    };

    const prepareLayers = function (suffix: string) {
      const prefixes: any = options.layersPrefixes;
      const layers: { [key: string]: any } = {};

      for (let featureKey in prefixes) {
        featureKey = featureKey as any;
        const featureValue: any = prefixes[featureKey];

        layers[featureKey] = {};

        for (const typeKey in featureValue) {
          const layer = featureValue[typeKey] + suffix;

          layers[featureKey][typeKey] = layer;

          if (map.getLayer(layer)) map.removeLayer(layer);
        }
      }

      return layers;
    };

    const makeLayerInteractive = (layer: any) => {
      map.on("mousemove", layer, (event: any) => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", layer, (event: any) => {
        map.getCanvas().style.cursor = "grab";
      });
    };

    const renderGeoJson = (geoJsons: any) => {
      return new Promise((resolve, reject) => {
        for (let key in options.geoJsons) {
          const value = options.geoJsons[key];

          const source = prepareSource(key);
          const layers = prepareLayers(key);

          const mustRender = options.layers;

          const primaryColor = options.colors[options.defaultStyle].primary;
          const secondaryColor = options.colors[options.defaultStyle].secondary;

          map.addSource(source, {
            type: "geojson",
            data: value,
          });

          if (mustRender.polygon.fill)
            map.addLayer({
              id: layers.polygon.fill,
              type: "fill",
              minzoom: 1,
              source: source,
              filter: [
                "any",
                ["==", ["geometry-type"], "Polygon"],
                ["==", ["geometry-type"], "MultiPolygon"],
              ],
              paint: {
                "fill-color": [
                  "interpolate",
                  ["exponential", 1],
                  ["zoom"],
                  1,
                  primaryColor,
                  12,
                  primaryColor,
                ],
                "fill-opacity": [
                  "interpolate",
                  ["exponential", 0.8],
                  ["zoom"],
                  0,
                  0.5,
                  12,
                  0.4,
                ],
              },
            });

          makeLayerInteractive({
            layer: layers.polygon.fill,
          });

          if (mustRender.polygon.line)
            map.addLayer({
              id: layers.polygon.line,
              type: "line",
              minzoom: 1,
              source: source,
              filter: [
                "any",
                ["==", ["geometry-type"], "Polygon"],
                ["==", ["geometry-type"], "MultiPolygon"],
              ],
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-width": [
                  "interpolate",
                  ["exponential", 1],
                  ["zoom"],
                  0,
                  0,
                  12,
                  4,
                ],
                "line-color": [
                  "interpolate",
                  ["exponential", 1],
                  ["zoom"],
                  1,
                  secondaryColor,
                  12,
                  secondaryColor,
                ],
                "line-opacity": [
                  "interpolate",
                  ["exponential", 0.8],
                  ["zoom"],
                  0,
                  0.5,
                  12,
                  1,
                ],
              },
            });

          makeLayerInteractive({
            layer: layers.polygon.line,
          });

          if (mustRender.polyline.line)
            map.addLayer({
              id: layers.polyline.line,
              type: "line",
              minzoom: 1,
              source: source,
              filter: [
                "any",
                ["==", ["geometry-type"], "LineString"],
                ["==", ["geometry-type"], "MultiLineString"],
              ],
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-width": [
                  "interpolate",
                  ["exponential", 1],
                  ["zoom"],
                  0,
                  1,
                  12,
                  6,
                ],
                "line-color": [
                  "interpolate",
                  ["exponential", 1],
                  ["zoom"],
                  1,
                  secondaryColor,
                  12,
                  secondaryColor,
                ],
                "line-opacity": [
                  "interpolate",
                  ["exponential", 0.8],
                  ["zoom"],
                  0,
                  0.5,
                  12,
                  1,
                ],
                "line-dasharray": [4, 4],
              },
            });

          makeLayerInteractive({
            layer: layers.polyline.line,
          });

          if (mustRender.polyline.symbol)
            map.addLayer({
              id: layers.polyline.symbol,
              type: "symbol",
              minzoom: 1,
              source: source,
              filter: [
                "any",
                ["==", ["geometry-type"], "LineString"],
                ["==", ["geometry-type"], "MultiLineString"],
              ],
              layout: {
                "icon-image": options.defaultIcon,
                "icon-size": 1,
                "icon-anchor": "center",
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
              },
              paint: {
                "icon-opacity": [
                  "interpolate",
                  ["exponential", 0.8],
                  ["zoom"],
                  0,
                  0.5,
                  4,
                  1,
                ],
              },
            });

          makeLayerInteractive({
            layer: layers.polyline.symbol,
          });

          if (mustRender.point.symbol)
            map.addLayer({
              id: layers.point.symbol,
              type: "symbol",
              minzoom: 1,
              source: source,
              filter: [
                "any",
                ["==", ["geometry-type"], "Point"],
                ["==", ["geometry-type"], "MultiPoint"],
              ],
              layout: {
                "icon-image": [
                  "case",
                  ["has", "icon"],
                  ["get", "icon"],
                  ["has", "type"],
                  ["get", "type"],
                  options.defaultIcon,
                ],
                "icon-size": 1,
                "icon-anchor": "center",
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
              },
              paint: {
                "icon-opacity": [
                  "interpolate",
                  ["exponential", 0.8],
                  ["zoom"],
                  0,
                  0.5,
                  4,
                  1,
                ],
              },
            });

          makeLayerInteractive({
            layer: layers.point.symbol,
          });
        }

        resolve(true);
      });
    };

    const load = () => {
      return new Promise((resolve, reject) => {
        build().then(() => {
          loadIcons()
            .then(() => {
              fetchGeoJson()
                .then((geoJsons) => {
                  renderGeoJson(geoJsons)
                    .then(() => {
                      resolve(true);
                    })
                    .catch((error: Error) => {
                      reject(error);
                    });
                })
                .catch((error: Error) => {
                  reject(error);
                });
            })
            .catch((error: Error) => {
              reject(error);
            });
        });
      });
    };

    setMap(map);
    setLoad(load);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { map, load };
};
