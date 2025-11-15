export interface ISensorHistoryRow {
  time: string;
  weight: number | null;
  internalTemperature: number | null;
  internalHumidity: number | null;
  externalTemperature: number | null;
}

export interface ITranslatedHistoryRow {
  'Data/Hora': string;
  'Peso (kg)': number | null;
  'Temp. Interna (°C)': number | null;
  'Umidade Interna (%)': number | null;
  'Temp. Externa (°C)': number | null;
}
