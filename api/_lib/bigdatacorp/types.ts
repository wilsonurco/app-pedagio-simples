export type BigDataCorpBasicData = {
  Name?: string;
  BirthDate?: string;
  CapturedBirthDateFromRFSource?: string;
  TaxIdNumber?: string;
  TaxIdStatus?: string;
};

export type BigDataCorpResultItem = {
  MatchKeys?: string;
  BasicData?: BigDataCorpBasicData;
};

export type BigDataCorpResponse = {
  Result?: BigDataCorpResultItem[];
  QueryId?: string;
  Status?: Record<string, Array<{ Code?: number; Message?: string }>>;
};

export type CpfBasicData = {
  cpf: string;
  name: string;
  birthDate: string;
};
