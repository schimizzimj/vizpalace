import { assert, expect, test, describe, beforeEach, afterEach } from "vitest";
import { createBarChart } from "../charts/barChart";

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
});
