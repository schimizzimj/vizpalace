import * as d3 from "d3";
import { BarChartOptions, ChartOptions } from "../../types";
import { isScaleBand } from "../utils/utils";

export const defaultOptions: ChartOptions = {
  width: 600,
  height: 400,
  margin: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
  },
};

export function initializeChartDimensions(
  userOptions: Partial<ChartOptions> = {}
): ChartOptions {
  const options = { ...defaultOptions, ...userOptions };

  return options;
}

export function initializeBarChartDimensions(
  userOptions: Partial<BarChartOptions> = {}
): BarChartOptions {
  const options = initializeChartDimensions(userOptions);
  return options;
}

export function createSVG(
  container: HTMLElement,
  options: ChartOptions
): d3.Selection<SVGGElement, unknown, any, any> {
  const { width, height, margin } = options;
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + (margin?.left ?? 0) + (margin?.right ?? 0))
    .attr("height", height + (margin?.top ?? 0) + (margin?.bottom ?? 0))
    .append("g")
    .attr("transform", `translate(${margin?.left ?? 0}, ${margin?.top ?? 0})`);

  return svg;
}

type XScale =
  | d3.ScaleBand<string>
  | d3.ScaleTime<number, number>
  | d3.ScaleLinear<number, number>;

export function appendXAxis(
  svg: d3.Selection<SVGGElement, unknown, any, any>,
  scale: XScale,
  height: number
): void {
  if (isScaleBand(scale)) {
    const axis = d3.axisBottom(scale);
    svg.append("g").attr("transform", `translate(0, ${height})`).call(axis);
  } else {
    const axis = d3.axisBottom(
      scale as d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>
    );
    svg.append("g").attr("transform", `translate(0, ${height})`).call(axis);
  }
}

export function appendYAxis(
  svg: d3.Selection<SVGGElement, unknown, any, any>,
  scale: d3.AxisScale<number | { valueOf(): number }>
): void {
  svg.append("g").call(d3.axisLeft(scale));
}
