import * as d3 from "d3";
import {
  createSVG,
  appendXAxis,
  appendYAxis,
  initializeLineChartDimensions,
} from "../base/chartUtils";
import { ChartData, DataPoint, LineChartOptions } from "../../types";
import { isScaleBand } from "../utils/utils";

export function createLineChart<T = number | string | Date>(
  element: HTMLElement,
  data: ChartData<T>,
  userOptions: Partial<LineChartOptions> = {}
): void {
  const options = initializeLineChartDimensions(userOptions);
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

  data.forEach((series, i) => {
    // Create the line generator
    const line = d3
      .line<DataPoint<T>>()
      .x((d) => {
        if (isScaleBand(xScale)) {
          return (xScale(d.x as string) ?? 0) + xScale.bandwidth() / 2;
        }
        // TODO: Fix the any cast
        return xScale(d.x as any) ?? 0;
      })
      .y((d) => yScale(d.y ?? 0) ?? 0);

    // Draw the line
    const linePath = svg
      .datum(series.values)
      .append("path")
      .attr("class", `line line-${i}`)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", series.color ?? "black")
      .attr("stroke-width", 1.5);

    if (linePath.node()?.getTotalLength) {
      const totalLength = linePath.node()?.getTotalLength() ?? 0;
      linePath
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    }
  });

  appendXAxis(svg, xScale, chartDimensions, xAxis ?? {});
  appendYAxis(svg, yScale, chartDimensions, yAxis ?? {});
}
