import WashingCenter from "../models/washing-center.model";
import type { IWashingCenterRepository } from "./interfaces/washing-center-repository.interface";

interface CreateWashingCenterInput {
  centerName: string;
  location: string;
  contactPhone: string;
  operationStatus: string;
}

export class WashingCenterRepository implements IWashingCenterRepository {
  async count() {
    return WashingCenter.countDocuments();
  }

  async insertMany(centers: CreateWashingCenterInput[]) {
    return WashingCenter.insertMany(centers);
  }

  async findAll() {
    return WashingCenter.find().sort({ centerName: 1 });
  }

  async findById(id: string) {
    return WashingCenter.findById(id);
  }

  async create(input: {
    centerName: string;
    location: string;
    contactPhone: string;
    operationStatus: string;
  }) {
    return WashingCenter.create(input);
  }
}
