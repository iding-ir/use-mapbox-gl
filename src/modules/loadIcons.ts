import { Map } from "mapbox-gl";
import { Options } from "../hooks/Options.d";

export const loadIcons = (map: Map, options: Options) => {
  return new Promise<void>((resolve, reject) => {
    const promises: { [key: string]: Promise<void> } = {};

    for (let key in options.icons) {
      const value = options.icons[key];

      promises[key] = new Promise<void>((resolve, reject) => {
        map.loadImage(value, (error, image: any) => {
          if (error) {
            reject(error);
          } else {
            map.addImage(key, image);

            resolve();
          }
        });
      });
    }

    Promise.all(Object.values(promises))
      .then(() => {
        resolve();
      })
      .catch((error: Error) => {
        reject(error);
      });
  });
};
