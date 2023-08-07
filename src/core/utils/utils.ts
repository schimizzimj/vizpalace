import { ScaleBand } from "d3-scale";

export function isScaleBand(scale: any): scale is ScaleBand<any> {
  return "bandwidth" in scale;
}
