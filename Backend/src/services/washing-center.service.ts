import type { IWashingCenterRepository } from "../repositories/interfaces/washing-center-repository.interface";

const defaultCenters = [
  {
    centerName: "WashFlow Downtown Hub",
    location: "Downtown City Center",
    contactPhone: "+1-555-0101",
    operationStatus: "active",
  },
  {
    centerName: "WashFlow North Point",
    location: "North Point Avenue",
    contactPhone: "+1-555-0102",
    operationStatus: "active",
  },
  {
    centerName: "WashFlow Lakeside",
    location: "Lakeside Market Road",
    contactPhone: "+1-555-0103",
    operationStatus: "busy",
  },
];

export class WashingCenterService {
  constructor(
    private readonly washingCenterRepository: IWashingCenterRepository,
  ) {}

  async listCenters() {
    const count = await this.washingCenterRepository.count();

    if (count === 0) {
      await this.washingCenterRepository.insertMany(defaultCenters);
    }

    return this.washingCenterRepository.findAll();
  }

  async findCenterById(id: string) {
    return this.washingCenterRepository.findById(id);
  }
}
