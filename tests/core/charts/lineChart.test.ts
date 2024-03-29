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
        chartDimensions: {
          width: 100,
          height: 100,
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      };
      createLineChart(container, data, config);

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
          margin: { top: 10, right: 10, bottom: 10, left: 10 },
        },
      };
      const { width, margin, height } = config.chartDimensions;
      createLineChart(container, data, config);

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
      createLineChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const xAxis = svg.querySelector(".x-axis");
      assert(xAxis);
    });

    test("it should hide the x axis when disabled", () => {
      createLineChart(container, data, {
        xAxis: {
          enabled: false,
        },
      });

      const svg = container.querySelector("svg");
      assert(svg);

      const xAxis = svg.querySelector(".x-axis");
      expect(xAxis).toBeNull();
    });

    test("should not display x axis title by default", () => {
      createLineChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const xAxisTitle = svg.querySelector(".x-axis-title");
      expect(xAxisTitle).toBeNull();
    });

    test("it should display x axis title when enabled", () => {
      createLineChart(container, data, {
        xAxis: {
          title: "X Axis",
        },
      });

      const svg = container.querySelector("svg");
      assert(svg);

      const xAxisTitle = svg.querySelector(".x-axis-title");
      assert(xAxisTitle);
      expect(xAxisTitle.textContent).toBe("X Axis");
    });

    test("it should display y axis by default", () => {
      createLineChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const yAxis = svg.querySelector(".y-axis");
      assert(yAxis);
    });

    test("it should hide the y axis when disabled", () => {
      createLineChart(container, data, {
        yAxis: {
          enabled: false,
        },
      });

      const svg = container.querySelector("svg");
      assert(svg);

      const yAxis = svg.querySelector(".y-axis");
      expect(yAxis).toBeNull();
    });

    test("should not display y axis title by default", () => {
      createLineChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const yAxisTitle = svg.querySelector(".y-axis-title");
      expect(yAxisTitle).toBeNull();
    });

    test("it should display y axis title when enabled", () => {
      createLineChart(container, data, {
        yAxis: {
          title: "Y Axis",
        },
      });

      const svg = container.querySelector("svg");
      assert(svg);

      const yAxisTitle = svg.querySelector(".y-axis-title");
      assert(yAxisTitle);
      expect(yAxisTitle.textContent).toBe("Y Axis");
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
