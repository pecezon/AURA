import { prisma } from "../config/prisma";
import { RegulationCreateDTO, RegulationResponse } from "../modules/regulation/regulation.types";

class ConflictError extends Error {
  statusCode = 409;
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class RegulationService {
  async createRegulation(dto: RegulationCreateDTO): Promise<RegulationResponse> {
    const existing = await prisma.regulation.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictError("Regulation with this name already exists");

    const created = await prisma.regulation.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
      },
    });

    return {
      id: created.id,
      name: created.name,
      description: created.description,
    };
  }

  async getAllRegulations(): Promise<RegulationResponse[]> {
    const regulations = await prisma.regulation.findMany();
    return regulations.map((reg) => ({
      id: reg.id,
      name: reg.name,
      description: reg.description,
    }));
  }
}

export const regulationService = new RegulationService();
