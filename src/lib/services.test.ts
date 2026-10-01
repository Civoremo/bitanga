import { describe, it, expect } from "vitest";
import { services, getService } from "./services";

describe("services data", () => {
  it("has unique slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every service has deliverables", () => {
    for (const service of services) {
      expect(service.deliverables.length).toBeGreaterThan(0);
    }
  });

  it("every service has a known icon key", () => {
    const valid = new Set(["cube", "code", "spark", "layers"]);
    for (const service of services) {
      expect(valid.has(service.icon)).toBe(true);
    }
  });
});

describe("getService", () => {
  it("returns a service by slug", () => {
    const first = services[0];
    expect(getService(first.slug)).toEqual(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getService("nope")).toBeUndefined();
  });
});
