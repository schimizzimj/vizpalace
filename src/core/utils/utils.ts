import { ScaleBand } from "d3-scale";

export function isScaleBand(scale: any): scale is ScaleBand<any> {
  return "bandwidth" in scale;
}

export function isNumber(value: string | number | Date): value is number {
  return typeof value === "number";
}

export function isDate(value: string | number | Date): value is Date {
  return value instanceof Date;
}

export function isString(value: string | number | Date): value is string {
  return typeof value === "string";
}
