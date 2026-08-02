import Appraisal, { IAppraisal } from '../models/Appraisal';

export class AppraisalRepository {
  async create(appraisalData: Partial<IAppraisal>): Promise<IAppraisal> {
    const appraisal = new Appraisal(appraisalData);
    return await appraisal.save();
  }

  async findByUserId(userId: string): Promise<IAppraisal[]> {
    return await Appraisal.find({ userId }).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IAppraisal | null> {
    return await Appraisal.findById(id);
  }
}

export const appraisalRepository = new AppraisalRepository();
