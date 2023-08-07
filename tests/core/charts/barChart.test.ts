import { assert, expect, test, describe, beforeEach, afterEach } from "vitest";
import { createBarChart } from "../../../src/core/charts/barChart";
import { BarData } from "../../../src/types";

describe("barChart", () => {
  let container: HTMLDivElement;
  let data: BarData[];

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    data = [
      { label: "foo", value: 10 },
      { label: "bar", value: 20 },
      { label: "baz", value: 30 },
    ];
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("it should render a bar chart", () => {
    createBarChart(container, data, {});

    const svg = container.querySelector("svg");
    assert(svg);

    const bars = svg.querySelectorAll("rect");
    expect(bars.length).toBe(3);
  });

  test("it should use custom width and height", () => {
    const config = {
      width: 100,
      height: 100,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    };
    createBarChart(container, data, config);

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
    createBarChart(container, data, config);

    const svg = container.querySelector("svg");
    assert(svg);
    expect(svg.getAttribute("width")).toBe(
      `${config.width + config.margin.left + config.margin.right}`
    );
    expect(svg.getAttribute("height")).toBe(
      `${config.height + config.margin.top + config.margin.bottom}`
    );
  });

  test("it should look visually correct", async () => {
    createBarChart(container, data, { animationDuration: 0 });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = container.innerHTML;
    expect(result).toMatchSnapshot();
  });
});
