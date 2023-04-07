import { v4 as uuidv4 } from "uuid";

export default class Assignment {
  public id = uuidv4();

  public name: string;

  public grade: number;

  public weight: number;

  public constructor(name?: string, grade?: number, weight?: number) {
    this.name = name ?? "";
    this.grade = grade ?? 0;
    this.weight = weight ?? 0;
  }
}
