import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import PageNotFound from "@/pages/404";

describe("404 page testing", () => {
  it("render correctly", () => {
    const { container } = render(<PageNotFound />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="flex h-full flex-col items-center justify-center px-4"
        >
          <h2
            class="bg-gradient-to-r from-red-600 to-teal-500 bg-clip-text text-[80px] font-bold text-transparent"
          >
            404
          </h2>
          <h3
            class="text-[30px]"
          >
            Page not found
          </h3>
          <p
            class="my-5 text-[16px]"
          >
            The page you are looking for doesn't exist or an other error occurred.
          </p>
        </div>
      </div>
    `);
  });
});
