import * as d3 from "d3";
import { ScaleBand, ScaleLinear, ScaleTime } from "d3";
import {
  initializeChartDimensions,
  createSVG,
  appendXAxis,
  appendYAxis,
} from "../base/chartUtils";
import { ChartData, ChartOptions } from "../../types";
import { isScaleBand } from "../utils/utils";

export function createBarChart<T = string | number | Date>(
  element: HTMLElement,
  data: ChartData<T>,
  userOptions: Partial<ChartOptions> = {}
): void {
  // Merge default options with user options
  const options = initializeChartDimensions(userOptions);
  let { width, height, animationDuration } = options;
  const svg = createSVG(element, options);
  const duration = animationDuration ?? 0;

  const allDataPoints = data.flatMap((series) => series.values);

  let xScale:
    | ScaleBand<string>
    | ScaleTime<number, number>
    | ScaleLinear<number, number>;

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

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(allDataPoints, (d) => d.y ?? 0) ?? 0])
    .range([height, 0]);

  const barWidth = isScaleBand(xScale) ? xScale.bandwidth() / data.length : 20;

  data.forEach((series, i) => {
    const bars = svg
      .selectAll(`.bar-${i}`)
      .data(series.values)
      .enter()
      .append("rect")
      .attr("class", `bar bar-${i}`)
      .attr("x", (d) => {
        if (isScaleBand(xScale)) {
          return (xScale(d.x) ?? 0) + barWidth * i;
        } else {
          return (
            (xScale as ScaleLinear<number, number> | ScaleTime<number, number>)(
              d.x as number | Date
            ) -
            barWidth / 2 +
            barWidth * i
          );
        }
      })
      .attr("y", height)
      .attr("width", barWidth)
      .attr("fill", series.color ?? "steelblue")
      .attr("height", 0);

    bars
      .transition()
      .duration(duration)
      .ease(d3.easeCubicInOut)
      .attr("y", (d) => yScale(d.y ?? 0))
      .attr("height", (d) => height - yScale(d.y ?? 0));
  });

  appendXAxis(svg, xScale, height);
  appendYAxis(svg, yScale);
}
