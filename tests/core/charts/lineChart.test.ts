import { assert, expect, test, describe, beforeEach, afterEach } from "vitest";
import { createLineChart } from "../../../src/core/charts/lineChart";
import { ChartData } from "../../../src/types";

describe("lineChart", () => {
  let container: HTMLDivElement;
  let data: ChartData;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("single series", () => {
    beforeEach(() => {
      data = [
        {
          name: "Series 1",
          values: [
            { x: new Date("2020-01-01"), y: 10 },
            { x: new Date("2020-01-02"), y: 20 },
            { x: new Date("2020-01-03"), y: 30 },
          ],
        },
      ];
    });

    test("it should render a line chart", () => {
      createLineChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const lines = svg.querySelectorAll(".line");
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

    test("it should look visually correct", async () => {
      createLineChart(container, data, {});
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = container.innerHTML;
      expect(result).toMatchSnapshot();
    });
  });

  describe("multiple series", () => {
    beforeEach(() => {
      data = [
        {
          name: "Series 1",
          values: [
            { x: new Date("2020-01-01"), y: 10 },
            { x: new Date("2020-01-02"), y: 20 },
            { x: new Date("2020-01-03"), y: 30 },
          ],
        },
        {
          name: "Series 2",
          values: [
            { x: new Date("2020-01-01"), y: 30 },
            { x: new Date("2020-01-02"), y: 20 },
            { x: new Date("2020-01-03"), y: 10 },
          ],
        },
      ];
    });

    test("it should render a line chart", () => {
      createLineChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const lines = svg.querySelectorAll(".line");
      expect(lines.length).toBe(2);
    });

    test("it should look visually correct", async () => {
      createLineChart(container, data, {});
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = container.innerHTML;
      expect(result).toMatchSnapshot();
    });
  });
});
