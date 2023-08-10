import * as d3 from "d3";
import { BarChartOptions, ChartOptions, LineChartOptions } from "../../types";

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
  console.log("dimensions", chartDimensions);
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3
    .select(container)
    .select("svg");
  if (svg.empty()) {
    svg = d3.select(container).append("svg");
  }
  svg
    .attr("width", width + (margin?.left ?? 0) + (margin?.right ?? 0))
    .attr("height", height + (margin?.top ?? 0) + (margin?.bottom ?? 0));

  let chartWrapper: d3.Selection<SVGGElement, unknown, null, undefined> =
    svg.select("g.chart-wrapper");
  if (chartWrapper.empty()) {
    chartWrapper = svg.append("g").attr("class", "chart-wrapper");
  }
  chartWrapper.attr(
    "transform",
    `translate(${margin?.left ?? 0}, ${margin?.top ?? 0})`
  );

  return chartWrapper;
}
