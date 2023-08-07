import { assert, expect, test, describe, beforeEach, afterEach } from "vitest";
import { createLineChart } from "../charts/lineChart";

describe("lineChart", () => {
  let container: HTMLDivElement;
  let data: LineData[];

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    data = [
      { date: new Date("2020-01-01"), value: 10 },
      { date: new Date("2020-01-02"), value: 20 },
      { date: new Date("2020-01-03"), value: 30 },
    ];
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("it should render a line chart", () => {
    createLineChart(container, data, {});

    const svg = container.querySelector("svg");
    assert(svg);

    const lines = svg.querySelectorAll("path");
    expect(lines.length).toBe(1);
  });

  test("it should use custom width and height", () => {
    const config = {
      width: 100,
      height: 100,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    };
    createLineChart(container, data, config);

    const svg = container.querySelector("svg");
    assert(svg);
    expect(svg.getAttribute("width")).toBe("100");
    expect(svg.getAttribute("height")).toBe("100");
  });

  test("it should use custom margins", () => {
    const config = {
      width: 100,
      height: 100,
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
    };
    createLineChart(container, data, config);

    const svg = container.querySelector("svg");
    assert(svg);
    expect(svg.getAttribute("width")).toBe(
      `${config.width + config.margin.left + config.margin.right}`
    );
    expect(svg.getAttribute("height")).toBe(
      `${config.height + config.margin.top + config.margin.bottom}`
    );
  });

  test("it should look visually correct", () => {
    createLineChart(container, data, {});
    const result = container.innerHTML;
    expect(result).toMatchSnapshot();
  });
});
