import _ from "lodash";
import ErrorResponse from "../models/error";

export const serializeResponse =
  <T>(options?: { toCamelCase?: boolean }) =>
  (response: Response) => {
    // default is to convert to camel case
    const toCamelCase =
      options?.toCamelCase === null || options?.toCamelCase === undefined
        ? true
        : options?.toCamelCase;
    if (!_.inRange(response.status, 200, 300)) {
      return response.text().then((text) => {
        switch (response.status) {
          default: {
            const errorResponse = deepMapKeys(
              JSON.parse(idReviver(text)),
              (_, k) => (toCamelCase ? _.camelCase(k) : k),
              toCamelCase
            ) as ErrorResponse;

            throw errorResponse;
          }
        }
      });
    }

    return response
      .text()
      .then(
        (text) =>
          deepMapKeys(
            JSON.parse(idReviver(text)),
            (_, k) => (toCamelCase ? _.camelCase(k) : k),
            toCamelCase
          ) as T
      );
  };

const deepMapKeys = <T>(
  obj: T,
  fn: _.ObjectIterator<any, any>,
  toCamelCase: boolean
): any => {
  if (_.isArray(obj)) {
    return obj.map((innerObj) => deepMapKeys(innerObj, fn, toCamelCase));
  } else if (_.isObject(obj)) {
    const x: Record<string, unknown> = {};

    Object.keys(obj).forEach((k) => {
      const currObj = Object(obj);
      const key = toCamelCase ? _.camelCase(k) : k;
      x[key] = deepMapKeys(currObj[k], fn, toCamelCase);
    });

    return x as T;
  }

  return obj as T;
};

const idReviver = (text: string) => text.replace(/"id":(\d+)/g, '"id":"$1"');
