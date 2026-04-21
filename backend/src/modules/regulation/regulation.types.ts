export interface RegulationCreateDTO {
  name: string;
  description?: string | null;
}

export interface RegulationResponse {
  id: string;
  name: string;
  description?: string | null;
}
