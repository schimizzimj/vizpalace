export interface LegendData {
  label: string;
  color: string;
}

export interface LegendOptions {
  x: number;
  y: number;
}

export function drawLegend(
  svg: d3.Selection<SVGGElement, unknown, any, any>,
  data: LegendData[],
  options: LegendOptions
): d3.Selection<SVGGElement, unknown, any, any> {
  let legendGroup: d3.Selection<SVGGElement, any, any, any> =
    svg.select("g.legend");
  if (legendGroup.empty()) {
    legendGroup = svg.append("g").attr("class", "legend");
  }

  const legendItems = legendGroup
    .selectAll(".legend-item")
    .data(data)
    .join("g")
    .attr("class", "legend-item")
    .attr("transform", (_, i) => `translate(0, ${i * 20})`);

  legendItems
    .selectAll(".legend-color")
    .data((d) => [d])
    .join("rect")
    .attr("class", "legend-color")
    .attr("x", options.x)
    .attr("y", options.y)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => d.color);

  legendItems
    .selectAll(".legend-label")
    .data((d) => [d])
    .join("text")
    .attr("class", "legend-label")
    .attr("x", options.x + 15)
    .attr("y", options.y + 10)
    .text((d) => d.label);

  return legendGroup;
}
