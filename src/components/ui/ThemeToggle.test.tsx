import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

function renderToggle() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe("ThemeToggle", () => {
  it("renders a button", () => {
    renderToggle();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("exposes an accessible label once mounted", async () => {
    renderToggle();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /switch to dark theme/i })
      ).toBeInTheDocument();
    });
  });

  it("toggles the theme to dark on click", async () => {
    const user = userEvent.setup();
    renderToggle();

    const button = await screen.findByRole("button", {
      name: /switch to dark theme/i,
    });
    await user.click(button);

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });
  });
});
