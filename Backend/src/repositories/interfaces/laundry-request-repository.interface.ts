export interface ILaundryRequestRepository {
  findById(id: string): Promise<any>;
  findByIdWithRelations(id: string): Promise<any>;
  create(input: {
    userId: string;
    washingCenterId?: string | null;
    clothesCount: number;
    preferredPickupDate: Date;
    status: string;
  }): Promise<any>;
  listByRole(userId: string, role: string): Promise<any>;
  save(request: any): Promise<any>;
}
