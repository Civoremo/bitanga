import { describe, it, expect } from "vitest";
import { projects, featuredProjects, getProject } from "./projects";

describe("projects data", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every project has a two-stop gradient", () => {
    for (const project of projects) {
      expect(project.gradient).toHaveLength(2);
      for (const stop of project.gradient) {
        expect(stop).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });

  it("every project has at least one tag", () => {
    for (const project of projects) {
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("featuredProjects", () => {
  it("only includes projects flagged as featured", () => {
    expect(featuredProjects.length).toBeGreaterThan(0);
    expect(featuredProjects.every((p) => p.featured)).toBe(true);
  });
});

describe("getProject", () => {
  it("returns a project by slug", () => {
    const first = projects[0];
    expect(getProject(first.slug)).toEqual(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});
