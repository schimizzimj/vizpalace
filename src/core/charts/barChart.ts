import * as d3 from "d3";
import {
  initializeChartDimensions,
  createSVG,
  appendXAxis,
  appendYAxis,
} from "../base/chartUtils";

export function createBarChart(
  element: HTMLElement,
  data: BarData[],
  userOptions: Partial<ChartOptions> = {}
): void {
  // Merge default options with user options
  const options = initializeChartDimensions(userOptions);
  const { width, height } = options;
  const svg = createSVG(element, options);

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

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.label) || 0)
    .attr("y", (d) => yScale(d.value ?? 0))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.value ?? 0));

  appendXAxis(svg, xScale, height);
  appendYAxis(svg, yScale);
}
