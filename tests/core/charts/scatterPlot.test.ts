import { assert, expect, test, describe, beforeEach, afterEach } from "vitest";
import { createScatterPlot } from "../../../src/core/charts/scatterPlot";
import { ChartData } from "../../../src/types";

describe("scatterChart", () => {
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

    test("it should render a scatter chart", () => {
      createScatterPlot(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const circles = svg.querySelectorAll(".circle");
      expect(circles.length).toBe(3);
    });

    test("it should use custom width and height", () => {
      const config = {
        chartDimensions: {
          width: 100,
          height: 100,
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      };
      createScatterPlot(container, data, config);

      const svg = container.querySelector("svg");
      assert(svg);
      expect(svg.getAttribute("width")).toBe("100");
      expect(svg.getAttribute("height")).toBe("100");
    });

    test("it should use custom margins", () => {
      const config = {
        chartDimensions: {
          width: 100,
          height: 100,
          margin: { top: 10, bottom: 20, left: 30, right: 40 },
        },
      };
      createScatterPlot(container, data, config);
      const { width, margin, height } = config.chartDimensions;

      const svg = container.querySelector("svg");
      assert(svg);
      expect(svg.getAttribute("width")).toBe(
        `${width + margin.left + margin.right}`
      );
      expect(svg.getAttribute("height")).toBe(
        `${height + margin.top + margin.bottom}`
      );
    });

    test("it should display x axis by default", () => {
      createScatterPlot(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const xAxis = svg.querySelector(".x-axis");
      assert(xAxis);
    });

    test("it should display y axis by default", () => {
      createScatterPlot(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const yAxis = svg.querySelector(".y-axis");
      assert(yAxis);
    });

    test("it should look visually correct", async () => {
      createScatterPlot(container, data, {});
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
            { x: new Date("2020-01-01"), y: 15 },
            { x: new Date("2020-01-02"), y: 25 },
            { x: new Date("2020-01-03"), y: 35 },
          ],
        },
      ];
    });

    test("it should render a scatter chart", () => {
      createScatterPlot(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const circles = svg.querySelectorAll(".circle");
      expect(circles.length).toBe(6);
    });

    test("it should look visually correct", async () => {
      createScatterPlot(container, data, {});
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = container.innerHTML;
      expect(result).toMatchSnapshot();
    });
  });
});
