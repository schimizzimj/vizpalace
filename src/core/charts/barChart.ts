import * as d3 from "d3";
import { ScaleBand, ScaleLinear, ScaleTime, ScaleOrdinal } from "d3";
import {
  createSVG,
  appendXAxis,
  appendYAxis,
  initializeBarChartDimensions,
} from "../base/chartUtils";
import { BarChartOptions, ChartData } from "../../types";
import { isScaleBand } from "../utils/utils";

interface ColoredSeriesPoint<T> extends d3.SeriesPoint<T> {
  color?: string;
  seriesName: string;
}

export function createBarChart<T = string | number | Date>(
  element: HTMLElement,
  data: ChartData<T>,
  userOptions: Partial<BarChartOptions> = {}
): void {
  // Merge default options with user options
  const options = initializeBarChartDimensions(userOptions);
  let { width, height, animationDuration, displayType } = options;
  const svg = createSVG(element, options);
  const duration = animationDuration ?? 1000;
  const type = displayType ?? "grouped";

  const allDataPoints = data.flatMap((series) => series.values);

  const colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(d3.schemeCategory10);

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
  const yScale = d3.scaleLinear().range([height, 0]);
  let yMax: number;

  if (type === "stacked") {
    const stackedData = prepareStackedData(data);
    yMax = d3.max(stackedData, (d) => d3.max(d, (d) => d[1])) ?? 0;
    yScale.domain([0, yMax]);
    drawStackedBars(
      svg,
      stackedData,
      xScale,
      yScale,
      colorScale,
      height,
      duration
    );
  } else {
    yMax = d3.max(allDataPoints, (d) => d.y ?? 0) ?? 0;
    yScale.domain([0, yMax]);
    drawGroupedBars(svg, data, xScale, yScale, colorScale, height, duration);
  }
  appendXAxis(svg, xScale, height);
  appendYAxis(svg, yScale);
}

function prepareStackedData<T = number | string | Date>(data: ChartData<T>) {
  const seriesNames = data.map((series) => series.name);
  const stackedDataFormat = data[0].values.map((d) => {
    const obj: any = { label: d.x };
    data.forEach((series) => {
      obj[series.name] = series.values.find((val) => val.x === d.x)?.y ?? 0;
    });
    return obj;
  });
  const stackedData = d3.stack().keys(seriesNames)(stackedDataFormat);
  stackedData.forEach((series, i) => {
    series.forEach((d) => {
      (d as ColoredSeriesPoint<T>).color = data[i].color;
      (d as ColoredSeriesPoint<T>).seriesName = data[i].name;
    });
  });
  return stackedData;
}

function drawGroupedBars<T = number | string | Date>(
  svg: d3.Selection<SVGGElement, unknown, any, any>,
  data: ChartData<T>,
  xScale:
    | ScaleBand<string>
    | ScaleTime<number, number>
    | ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
  colors: ScaleOrdinal<string, unknown>,
  height: number,
  duration: number
) {
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
      .attr("fill", series.color ?? (colors(series.name) as string))
      .attr("height", 0);
    bars
      .transition()
      .duration(duration)
      .ease(d3.easeCubicInOut)
      .attr("y", (d) => yScale(d.y ?? 0))
      .attr("height", (d) => height - yScale(d.y ?? 0))
      .delay((_, i) => i * (duration / series.values.length));
  });
}

function drawStackedBars(
  svg: d3.Selection<SVGGElement, unknown, any, any>,
  data: d3.Series<{ [key: string]: number }, string>[],
  xScale:
    | ScaleBand<string>
    | ScaleTime<number, number>
    | ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
  colors: d3.ScaleOrdinal<string, unknown>,
  height: number,
  duration: number
) {
  const barWidth = isScaleBand(xScale) ? xScale.bandwidth() : 20;

  const series = svg
    .selectAll(".series")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "series");

  const bars = series
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("fill", (d) => {
      if ((d as any).color) {
        return (d as any).color;
      } else if ((d as any).seriesName) {
        return colors((d as any).seriesName);
      }
      return "black";
    })
    .attr("x", (d) => {
      if (isScaleBand(xScale)) {
        return xScale(d.data.label) ?? 0;
      } else {
        return xScale(d.data.label as any) ?? 0;
      }
    })
    .attr("y", height)
    .attr("height", 0)
    .attr("width", barWidth);

  bars
    .transition()
    .duration(duration)
    .ease(d3.easeCubicInOut)
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
    .delay((_, i) => i * (duration / data[0].length));
}
