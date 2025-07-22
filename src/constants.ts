export namespace Scaled {
  export const ofValue = (value: number) => +(UIScale * value).toFixed(3);

  export const px = (value: number) => `${ofValue(value)}px`;
  export const rem = (pxValue: number) => `${ofValue(pxValue) / 16}rem`;
}
export const UIScale = 1;
