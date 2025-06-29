export type BioSample = {
    id: number;
    sampling_location: string;
    type: string;
    sampling_date: string; // ISO string
    sampling_operator: string;
  };

export type BioSampleCreate = {
  sampling_location: string;
  type: string;
  sampling_date?: string; // Optional - if absent, today's date will be used
  sampling_operator: string;
};

export type PaginatedBioSamples = {
  items: BioSample[];
  page: number;
  size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};