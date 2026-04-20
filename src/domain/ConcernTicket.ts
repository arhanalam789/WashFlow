import { Entity } from "../core/Entity";
import { ConcernType } from "./types";

export class ConcernTicket extends Entity {
  constructor(
    id: string,
    public requestId: string,
    public raisedByManagerId: string,
    public type: ConcernType,
    public expectedCount: number,
    public receivedCount: number,
    createdAt: Date = new Date(),
  ) {
    super(id, createdAt, createdAt);
  }

  updateCounts(expectedCount: number, receivedCount: number): void {
    this.expectedCount = expectedCount;
    this.receivedCount = receivedCount;
    this.touch();
  }
}
