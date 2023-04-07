import type Assignment from "./Assignment";

export default class Course {
  public name: string;

  public assignments: Assignment[];

  public constructor(name?: string, assignments?: Assignment[]) {
    this.name = name ?? "";
    this.assignments = assignments ?? [];
  }
}
