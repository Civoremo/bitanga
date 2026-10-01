import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { Navbar } from "./Navbar";
import { navItems } from "@/lib/site";

// Navbar reads the current path to mark the active link.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

function renderNavbar() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Navbar />
    </ThemeProvider>
  );
}

describe("Navbar", () => {
  it("renders a link for every nav item", () => {
    renderNavbar();
    for (const item of navItems) {
      // Links appear in both desktop and (hidden) mobile menus is not rendered
      // until opened, so there should be exactly one of each here.
      expect(
        screen.getByRole("link", { name: item.label })
      ).toBeInTheDocument();
    }
  });

  it("marks the home link as the current page", () => {
    renderNavbar();
    const home = screen.getByRole("link", { name: "Home" });
    expect(home).toHaveAttribute("aria-current", "page");
  });

  it("opens the mobile menu when the toggle is pressed", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Mobile menu duplicates the nav links, so each label now appears twice.
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(2);
  });
});
