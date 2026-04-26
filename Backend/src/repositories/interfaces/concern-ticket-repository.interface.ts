export interface IConcernTicketRepository {
  findById(id: string): Promise<any>;
  findByIdWithRelations(id: string): Promise<any>;
  listByRole(
    userId: string,
    role: string,
    assignedCenterId?: string | null,
  ): Promise<any>;
  create(input: {
    requestId: string;
    raisedByManagerId: string;
    type: string;
    expectedCount: number;
    receivedCount: number;
    note: string;
  }): Promise<any>;
  save(concern: any): Promise<any>;
}
