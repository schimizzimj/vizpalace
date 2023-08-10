import * as d3 from "d3";
import { ChartDimensions, XAxisOptions, YAxisOptions } from "../../types";
import { isScaleBand } from "../utils/utils";

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
