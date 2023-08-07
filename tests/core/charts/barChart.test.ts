import { assert, expect, test, describe, beforeEach, afterEach } from "vitest";
import { createBarChart } from "../../../src/core/charts/barChart";
import { ChartData } from "../../../src/types";

describe("barChart", () => {
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
          name: "Test",
          values: [
            { x: "foo", y: 10 },
            { x: "bar", y: 20 },
            { x: "baz", y: 30 },
          ],
        },
      ];
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

  describe("multiple series", () => {
    beforeEach(() => {
      data = [
        {
          name: "Test 1",
          values: [
            { x: "foo", y: 10 },
            { x: "bar", y: 20 },
            { x: "baz", y: 30 },
          ],
        },
        {
          name: "Test 2",
          values: [
            { x: "foo", y: 20 },
            { x: "bar", y: 30 },
            { x: "baz", y: 40 },
          ],
        },
      ];
    });

    test("it should render a bar chart", () => {
      createBarChart(container, data, {});

      const svg = container.querySelector("svg");
      assert(svg);

      const bars = svg.querySelectorAll("rect");
      expect(bars.length).toBe(6);
    });

    test("it should look visually correct", async () => {
      createBarChart(container, data, { animationDuration: 0 });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = container.innerHTML;
      expect(result).toMatchSnapshot();
    });
  });
});
