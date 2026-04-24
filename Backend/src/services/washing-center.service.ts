import type { IWashingCenterRepository } from "../repositories/interfaces/washing-center-repository.interface";
import { AppError } from "../utils/app-error";

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

  async createCenter(input: {
    centerName?: string;
    location?: string;
    contactPhone?: string;
    operationStatus?: string;
  }) {
    const { centerName, location, contactPhone, operationStatus = "active" } = input;

    if (!centerName || !location || !contactPhone) {
      throw new AppError(400, "Center name, location, and contact phone are required.");
    }

    return this.washingCenterRepository.create({
      centerName: centerName.trim(),
      location: location.trim(),
      contactPhone: contactPhone.trim(),
      operationStatus,
    });
  }

  async findCenterById(id: string) {
    return this.washingCenterRepository.findById(id);
  }
}
