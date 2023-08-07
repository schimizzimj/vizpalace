import * as d3 from "d3";
import {
  initializeChartDimensions,
  createSVG,
  appendXAxis,
  appendYAxis,
} from "../base/chartUtils";

export function createLineChart(
  element: HTMLElement,
  data: LineData[],
  userOptions: Partial<ChartOptions> = {}
): void {
  const options = initializeChartDimensions(userOptions);
  let { width, height, animationDuration } = options;

  const svg = createSVG(element, options);
  animationDuration = animationDuration ?? 0;

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date) as [Date, Date])
    .range([0, width]);

  const yMax =
    d3.max(data, (d) =>
      d.value !== undefined && d.value !== null ? d.value : 0
    ) || 0;

  const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

  // Create the line generator
  const line = d3
    .line<LineData>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value ?? 0));

  // Draw the line
  const linePath = svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5);

  if (linePath.node()?.getTotalLength) {
    const totalLength = linePath.node()?.getTotalLength() ?? 0;
    linePath
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(animationDuration)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }

  appendXAxis(svg, xScale, height);
  appendYAxis(svg, yScale);
}
