export type Metal = {
  id: string;
  name: string;
  value: number;
};

export type SampleData = {
  locationName: string;
  latitude: number;
  longitude: number;
  collectionDate: Date;
  metals: Metal[];
};

export type Report = {
  summary: string;
  hpi: number;
  mi: number;
  pli: number;
};

export type AnalysisResult = {
  report: Report | null;
  sampleData: SampleData;
  error: string | null;
};
