import * as d3 from "d3";
import { interpolatePath } from "d3-interpolate-path";
import { createSVG, initializeLineChartDimensions } from "../base/chartUtils";
import { ChartData, DataPoint, LineChartOptions } from "../../types";
import { isScaleBand } from "../utils/utils";
import { appendXAxis, appendYAxis } from "../base/axes";

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

  let linesWrapper: d3.Selection<SVGGElement, any, any, any> =
    svg.select(".lines-wrapper");
  if (linesWrapper.empty()) {
    linesWrapper = svg.append("g").attr("class", "lines-wrapper");
  }

  const lines = linesWrapper
    .selectAll<SVGPathElement, any>(".line")
    .data(data, (d) => d.name);

  lines.exit().remove();

  const lineGenerator = d3
    .line<DataPoint<T>>()
    .x((d) => {
      if (isScaleBand(xScale)) {
        return (xScale(d.x as string) ?? 0) + xScale.bandwidth() / 2;
      }
      // TODO: Fix the any cast
      return xScale(d.x as any) ?? 0;
    })
    .y((d) => yScale(d.y ?? 0) ?? 0);

  lines.join(
    (enter) =>
      enter
        .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", (d) => d.color ?? "black")
        .attr("d", (d) => lineGenerator(d.values))
        .attr("stroke-dasharray", function () {
          if (!this.getTotalLength) {
            return "none";
          }
          const totalLength: number = this.getTotalLength();
          return `${totalLength} ${totalLength}`;
        })
        .attr("stroke-dashoffset", function () {
          if (!this.getTotalLength) {
            return 0;
          }
          const totalLength: number = this.getTotalLength();
          return totalLength;
        })
        .attr("stroke-width", 1.5)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0),
    (update) =>
      update
        .attr("stroke-dasharray", "none")
        .attr("stroke-dashoffset", 0)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attrTween("d", function (d) {
          const previous = d3.select(this).attr("d");
          const current = lineGenerator(d.values) ?? "";
          return interpolatePath(previous, current);
        }),
    (exit) => exit.remove()
  );

  appendXAxis(svg, xScale, chartDimensions, xAxis ?? {});
  appendYAxis(svg, yScale, chartDimensions, yAxis ?? {});
}
