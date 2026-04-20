import { Entity } from "../core/Entity";

export class WashingCenter extends Entity {
  constructor(
    id: string,
    public centerName: string,
    public location: string,
    public contactPhone: string,
    public operationStatus: string,
    createdAt: Date = new Date(),
  ) {
    super(id, createdAt, createdAt);
  }
}
