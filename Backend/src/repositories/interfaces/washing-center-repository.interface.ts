export interface IWashingCenterRepository {
  count(): Promise<number>;
  insertMany(centers: Array<{
    centerName: string;
    location: string;
    contactPhone: string;
    operationStatus: string;
  }>): Promise<any>;
  findAll(): Promise<any>;
  findById(id: string): Promise<any>;
  create(input: {
    centerName: string;
    location: string;
    contactPhone: string;
    operationStatus: string;
  }): Promise<any>;
}
