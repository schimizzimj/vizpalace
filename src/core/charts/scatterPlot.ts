import * as d3 from "d3";
import { ChartData, ScatterPlotOptions } from "../../types";
import { createSVG, initializeScatterPlotDimensions } from "../base/chartUtils";
import { appendXAxis, appendYAxis } from "../base/axes";
import { isScaleBand } from "../utils/utils";

export function createScatterPlot<T = number | string | Date>(
  element: HTMLElement,
  data: ChartData<T>,
  userOptions: Partial<ScatterPlotOptions> = {}
) {
  const options = initializeScatterPlotDimensions(userOptions);
  let { chartDimensions, animationDuration, xAxis, yAxis } = options;
  const { width, height } = chartDimensions;
  const svg = createSVG(element, options);
  const duration = animationDuration ?? 0;

  const allDataPoints = data.flatMap((series) => series.values);

  let xScale:
    | d3.ScaleBand<string>
    | d3.ScaleTime<number, number>
    | d3.ScaleLinear<number, number>;

  if (typeof allDataPoints[0].x === "string") {
    xScale = d3
      .scaleBand()
      .padding(0.1)
      .domain(allDataPoints.map((d) => d.x as string));
  } else if (allDataPoints[0].x instanceof Date) {
    xScale = d3
      .scaleTime()
      .domain(d3.extent(allDataPoints, (d) => d.x as Date) as [Date, Date]);
  } else {
    xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(allDataPoints, (d) => d.x as number) as [number, number]
      );
  }

  xScale.range([0, width]);

  const yMin = d3.min(allDataPoints, (d) => d.y ?? 0) ?? 0;
  const yMax = d3.max(allDataPoints, (d) => d.y ?? 0) ?? 0;

  const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

  let circlesWrapper: d3.Selection<SVGGElement, any, any, any> =
    svg.select(".circles-wrapper");

  if (circlesWrapper.empty()) {
    circlesWrapper = svg.append("g").attr("class", "circles-wrapper");
  }

  const circles = circlesWrapper
    .selectAll<SVGCircleElement, any>(".circle")
    .data(allDataPoints);

  circles.exit().remove();

  circles
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", (d) => {
      if (isScaleBand(xScale)) {
        return (xScale(d.x as string) ?? 0) + xScale.bandwidth() / 2;
      } else {
        return xScale(d.x as any) ?? 0;
      }
    })
    .attr("cy", (d) => yScale(d.y ?? 0) ?? 0)
    .attr("r", 5)
    .attr("fill", "steelblue")
    .merge(circles)
    .transition()
    .duration(duration)
    .attr("cx", (d) => {
      if (isScaleBand(xScale)) {
        return (xScale(d.x as string) ?? 0) + xScale.bandwidth() / 2;
      } else {
        return xScale(d.x as any) ?? 0;
      }
    })
    .attr("cy", (d) => yScale(d.y ?? 0) ?? 0);

  appendXAxis(svg, xScale, chartDimensions, xAxis ?? {});
  appendYAxis(svg, yScale, chartDimensions, yAxis ?? {});
}
