import * as d3 from "d3";
import {
  initializeChartDimensions,
  createSVG,
  appendXAxis,
  appendYAxis,
} from "../base/chartUtils";
import { BarData, ChartOptions } from "../../types";

export function createBarChart(
  element: HTMLElement,
  data: BarData[],
  userOptions: Partial<ChartOptions> = {}
): void {
  // Merge default options with user options
  const options = initializeChartDimensions(userOptions);
  let { width, height, animationDuration } = options;
  const svg = createSVG(element, options);
  animationDuration = animationDuration ?? 1000;

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, width])
    .padding(0.1);

  const yMax =
    d3.max(data, (d) =>
      d.value !== undefined && d.value !== null ? d.value : 0
    ) || 0;

  const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

  const bars = svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.label) || 0)
    .attr("y", height)
    .attr("width", xScale.bandwidth())
    .attr("height", 0);

  bars
    .transition()
    .duration(animationDuration)
    .ease(d3.easeCubicInOut)
    .attr("y", (d) => yScale(d.value ?? 0))
    .attr("height", (d) => height - yScale(d.value ?? 0));

  appendXAxis(svg, xScale, height);
  appendYAxis(svg, yScale);
}
