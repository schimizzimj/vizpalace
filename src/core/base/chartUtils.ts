import * as d3 from "d3";
import {
  BarChartOptions,
  ChartDimensions,
  ChartOptions,
  LineChartOptions,
  XAxisOptions,
} from "../../types";
import { isScaleBand } from "../utils/utils";

export const defaultOptions: ChartOptions = {
  chartDimensions: {
    width: 600,
    height: 400,
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40,
    },
  },
};

export const defaultBarChartOptions: BarChartOptions = {
  ...defaultOptions,
  displayType: "grouped",
  xAxis: {
    enabled: true,
  },
  yAxis: {
    enabled: true,
  },
};

export const defaultLineChartOptions: LineChartOptions = {
  ...defaultOptions,
  xAxis: {
    enabled: true,
  },
  yAxis: {
    enabled: true,
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
  const options = { ...defaultBarChartOptions, ...userOptions };
  return options;
}

export function initializeLineChartDimensions(
  userOptions: Partial<LineChartOptions> = {}
): LineChartOptions {
  const options = { ...defaultLineChartOptions, ...userOptions };
  return options;
}

export function createSVG(
  container: HTMLElement,
  options: ChartOptions
): d3.Selection<SVGGElement, unknown, any, any> {
  const { chartDimensions } = options;
  const { width, height, margin } = chartDimensions;
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
  chartDimensions: ChartDimensions,
  xAxisOptions: XAxisOptions
): void {
  let xAxis: d3.Selection<SVGGElement, unknown, any, any>;
  if (xAxisOptions.enabled === false) return;

  const { width, height } = chartDimensions;
  if (isScaleBand(scale)) {
    const axis = d3.axisBottom(scale);
    xAxis = svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(axis);
  } else {
    const axis = d3.axisBottom(
      scale as d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>
    );
    xAxis = svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(axis);
  }

  // Add x axis title if defined
  if (xAxisOptions.title) {
    const xAxisHeight =
      xAxis.node() instanceof SVGGraphicsElement
        ? xAxis.node()?.getBBox().height ?? 20
        : 20;
    svg
      .append("text")
      .attr("class", "x-axis-title")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .attr("x", width / 2)
      .attr("y", height + xAxisHeight + 10)
      .text(xAxisOptions.title);
  }
}

export function appendYAxis(
  svg: d3.Selection<SVGGElement, unknown, any, any>,
  scale: d3.AxisScale<number | { valueOf(): number }>
): void {
  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(scale));
}
