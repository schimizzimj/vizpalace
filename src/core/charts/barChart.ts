import * as d3 from "d3";
import { ScaleBand, ScaleLinear, ScaleTime, ScaleOrdinal } from "d3";
import { createSVG, initializeBarChartDimensions } from "../base/chartUtils";
import { BarChartOptions, ChartData, DataPoint } from "../../types";
import { isScaleBand } from "../utils/utils";
import { appendXAxis, appendYAxis } from "../base/axes";

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
  let { chartDimensions, animationDuration, displayType, xAxis, yAxis } =
    options;
  const { width, height } = chartDimensions;
  const svg = createSVG(element, options);
  const duration = animationDuration ?? 500;
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
  appendXAxis(svg, xScale, chartDimensions, xAxis ?? {});
  appendYAxis(svg, yScale, chartDimensions, yAxis ?? {});
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

  const computeBarX = (d: DataPoint<T>) => {
    if (isScaleBand(xScale)) {
      return (xScale(d.x) ?? 0) + barWidth * (d.seriesIndex ?? 0);
    } else {
      return (
        (xScale as ScaleLinear<number, number> | ScaleTime<number, number>)(
          d.x as number | Date
        ) -
        barWidth / 2 +
        barWidth * (d.seriesIndex ?? 0)
      );
    }
  };

  let barsWrapper: d3.Selection<SVGGElement, any, any, any> =
    svg.select("g.bars-wrapper");
  if (barsWrapper.empty()) {
    barsWrapper = svg.append("g").attr("class", "bars-wrapper");
  }

  const series = barsWrapper
    .selectAll(".series")
    .data(data)
    .join("g")
    .attr("class", (_, i) => `series series-${i}`)
    .attr("fill", (d) => d.color ?? (colors(d.name) as string) ?? "black");

  const bars: d3.Selection<
    SVGRectElement,
    DataPoint<T>,
    SVGGElement,
    unknown
  > = series
    .each(function (d, i) {
      d.values.forEach((val) => {
        val.seriesName = d.name;
        val.seriesIndex = i;
      });
    })
    .selectAll("rect.bar")
    .data((d) => d.values) as unknown as d3.Selection<
    SVGRectElement,
    DataPoint<T>,
    SVGGElement,
    unknown
  >;

  bars
    .exit()
    .transition()
    .duration(duration)
    .ease(d3.easeCubicInOut)
    .attr("y", height)
    .attr("height", 0)
    .remove();

  bars
    .enter()
    .append("rect")
    .attr("class", (_, i) => `bar bar-${i}`)
    .attr("x", computeBarX)
    .attr("y", height)
    .attr("width", barWidth)
    .attr("height", 0)
    .merge(bars)
    .attr("fill", (d) =>
      d.seriesName ? (colors(d.seriesName) as string) : "black"
    )
    .transition()
    .duration(duration)
    .ease(d3.easeCubicInOut)
    .attr("x", computeBarX)
    .attr("y", (d) => yScale(d.y ?? 0))
    .attr("width", barWidth)
    .attr("height", (d) => height - yScale(d.y ?? 0))
    .delay((_, i) => i * (duration / data[0].values.length));
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

  const computeBarX = (d: d3.SeriesPoint<{ [key: string]: number }>) => {
    if (isScaleBand(xScale)) {
      return xScale(d.data.label) ?? 0;
    } else {
      return xScale(d.data.label as any) ?? 0;
    }
  };

  const computeFill = (d: d3.SeriesPoint<{ [key: string]: number }>) => {
    if ((d as any).color) {
      return (d as any).color;
    } else if ((d as any).seriesName) {
      return colors((d as any).seriesName);
    }
    return "black";
  };

  let barsWrapper: d3.Selection<SVGGElement, any, any, any> =
    svg.select("g.bars-wrapper");
  if (barsWrapper.empty()) {
    barsWrapper = svg.append("g").attr("class", "bars-wrapper");
  }

  const series = barsWrapper
    .selectAll(".series")
    .data(data)
    .join("g")
    .attr("class", (_, i) => `series series-${i}`);

  const bars: d3.Selection<
    SVGRectElement,
    d3.SeriesPoint<{ [key: string]: number }>,
    SVGGElement,
    unknown
  > = series.selectAll(".bar").data((d) => d) as unknown as d3.Selection<
    SVGRectElement,
    d3.SeriesPoint<{ [key: string]: number }>,
    SVGGElement,
    unknown
  >;

  bars
    .exit()
    .transition()
    .duration(duration / 2)
    .ease(d3.easeCubicInOut)
    .attr("y", height)
    .attr("height", 0)
    .remove();

  bars
    .enter()
    .append("rect")
    .attr("class", (_, i) => `bar bar-${i}`)
    .attr("x", computeBarX)
    .attr("y", height)
    .attr("height", 0)
    .attr("width", barWidth)
    .merge(bars)
    .attr("fill", computeFill)
    .transition()
    .duration(duration)
    .ease(d3.easeCubicInOut)
    .attr("width", barWidth)
    .attr("x", computeBarX)
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
    .delay((_, i) => i * (duration / data[0].length));
}
