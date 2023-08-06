import * as d3 from "d3";

// Default chart options
const defaultOptions: ChartOptions = {
  width: 600,
  height: 400,
  margin: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
  },
};

export function createBarChart(
  element: HTMLElement,
  data: BarData[],
  userOptions: Partial<ChartOptions> = {}
): void {
  // Merge default options with user options
  const options = { ...defaultOptions, ...userOptions };

  const width =
    options.width -
    (options?.margin?.left ?? 0) -
    (options?.margin?.right ?? 0);
  const height =
    options.height -
    (options?.margin?.top ?? 0) -
    (options?.margin?.bottom ?? 0);

  const svg = d3
    .select(element)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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
}
