import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Button from "../index";

describe("Button", () => {
    it("should render the correct content when given children as a prop", () => {
        const { getByText } = render(<Button>Click me</Button>);
        expect(getByText("Click me")).toBeInTheDocument();
    });

    it("should apply the override class", () => {
        const { container } = render(
            <Button overrideClass="transparent">Click me</Button>
        );
        const button = container.querySelector("button");
        expect(button).toHaveClass("transparent");
    });
});
