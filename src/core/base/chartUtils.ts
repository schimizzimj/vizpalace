import * as d3 from "d3";
import {
  BarChartOptions,
  ChartDimensions,
  ChartOptions,
  LineChartOptions,
  XAxisOptions,
  YAxisOptions,
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

  xAxis = svg.select("g.x-axis");

  const { width, height } = chartDimensions;
  if (isScaleBand(scale)) {
    const axis = d3.axisBottom(scale);
    if (xAxis.empty()) {
      xAxis = svg.append("g").attr("class", "x-axis");
    }
    xAxis.attr("transform", `translate(0, ${height})`).call(axis);
  } else {
    const axis = d3.axisBottom(
      scale as d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>
    );
    if (xAxis.empty()) {
      xAxis = svg.append("g").attr("class", "x-axis");
    }
    xAxis.attr("transform", `translate(0, ${height})`).call(axis);
  }

  // Add x axis title if defined
  if (xAxisOptions.title) {
    const xAxisHeight =
      xAxis.node() instanceof SVGGraphicsElement
        ? xAxis.node()?.getBBox().height ?? 20
        : 20;
    let xAxisTitle: d3.Selection<SVGTextElement, unknown, any, any> =
      svg.select("text.x-axis-title");
    if (xAxisTitle.empty()) {
      xAxisTitle = svg.append("text").attr("class", "x-axis-title");
    }
    xAxisTitle
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .attr("x", width / 2)
      .attr("y", height + xAxisHeight + 10)
      .text(xAxisOptions.title);
  }
}

export function appendYAxis(
  svg: d3.Selection<SVGGElement, unknown, any, any>,
  scale: d3.AxisScale<number | { valueOf(): number }>,
  chartDimensions: ChartDimensions,
  yAxisOptions: YAxisOptions
): void {
  if (yAxisOptions.enabled === false) return;

  let yAxis: d3.Selection<SVGGElement, unknown, any, any> =
    svg.select("g.y-axis");

  if (yAxis.empty()) {
    yAxis = svg.append("g").attr("class", "y-axis");
  }
  yAxis.call(d3.axisLeft(scale));

  // Add y axis title if defined
  if (yAxisOptions.title) {
    const yAxisWidth =
      yAxis.node() instanceof SVGGraphicsElement
        ? yAxis.node()?.getBBox().width ?? 20
        : 20;

    let yAxisTitle: d3.Selection<SVGTextElement, unknown, any, any> =
      svg.select("text.y-axis-title");
    if (yAxisTitle.empty()) {
      yAxisTitle = svg.append("text").attr("class", "y-axis-title");
    }
    yAxisTitle
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "auto")
      .attr(
        "transform",
        `translate(${-yAxisWidth - 10}, ${
          chartDimensions.height / 2
        }) rotate(-90)`
      )
      .text(yAxisOptions.title);
  }
}
