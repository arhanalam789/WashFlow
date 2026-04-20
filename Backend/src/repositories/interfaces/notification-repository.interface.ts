export interface INotificationRepository {
  findById(id: string): Promise<any>;
  create(input: {
    userId: string;
    requestId?: string | null;
    type: string;
    message: string;
    isRead?: boolean;
    sentAt?: Date;
  }): Promise<any>;
  listByUser(userId: string): Promise<any>;
  findByIdForUser(id: string, userId: string): Promise<any>;
  save(notification: any): Promise<any>;
  findByIdWithRelations(id: string): Promise<any>;
}
