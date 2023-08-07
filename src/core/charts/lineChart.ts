import * as d3 from "d3";

// Default chart options
const defaultOptions = {
  width: 600,
  height: 400,
  margin: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
  },
};

export function createLineChart(
  element: HTMLElement,
  data: LineData[],
  userOptions: Partial<ChartOptions> = {}
): void {
  const options = { ...defaultOptions, ...userOptions };
  const { width, height, margin } = options;

  const svg = d3
    .select(element)
    .append("svg")
    .attr("width", width + (margin?.left ?? 0) + (margin?.right ?? 0))
    .attr("height", height + (margin?.top ?? 0) + (margin?.bottom ?? 0))
    .append("g")
    .attr("transform", `translate(${margin?.left ?? 0},${margin?.top ?? 0})`);

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
  svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5);
}
