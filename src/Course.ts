import { v4 as uuidv4 } from "uuid";

import type Assignment from "./Assignment";

export default class Course {
  public id = uuidv4();

  public name: string;

  public assignments: Assignment[];

  public constructor(name?: string, assignments?: Assignment[]) {
    this.name = name ?? "";
    this.assignments = assignments ?? [];
  }
}
