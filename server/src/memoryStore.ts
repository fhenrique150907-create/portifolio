import { PORTFOLIO_PROJECTS_SEED } from "./projectsSeed";

export type ProjectRow = {
  id: number;
  title: string;
  description: string;
  stack: string;
  demo_link: string | null;
  github_link: string | null;
};

const seed: ProjectRow[] = PORTFOLIO_PROJECTS_SEED.map((p, i) => ({
  id: i + 1,
  ...p,
}));

let nextId = seed.length + 1;

let projects = [...seed];
export function getMemoryProjects(): ProjectRow[] {
  return [...projects].sort((a, b) => a.id - b.id);
}

export function addMemoryProject(input: {
  title: string;
  description: string;
  stack: string;
  demo_link: string | null;
  github_link: string | null;
}): ProjectRow {
  const row: ProjectRow = {
    id: nextId++,
    title: input.title,
    description: input.description,
    stack: input.stack,
    demo_link: input.demo_link,
    github_link: input.github_link,
  };
  projects = [...projects, row];
  return row;
}
