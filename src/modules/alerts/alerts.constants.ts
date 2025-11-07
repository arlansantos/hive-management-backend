export const ALERT_THRESHOLDS = {
  // Temperatura Interna (°C)
  INTERNAL_TEMP_MIN: 32.0, // Risco de hipotermia da cria
  INTERNAL_TEMP_MAX: 38.0, // Risco de superaquecimento

  // Umidade Interna (%)
  INTERNAL_HUMIDITY_MIN: 50.0,
  INTERNAL_HUMIDITY_MAX: 70.0,

  // Peso (kg)
  HARVEST_READY_WEIGHT: 60.0, // Peso de referência para sugerir colheita
  CRITICAL_WEIGHT_LOSS: -5.0, // Perda de 5kg (sugere roubo/enxameação)

  // Sensores (Valores de falha)
  SENSOR_FAILURE_TEMP: -127,
  SENSOR_FAILURE_HUMID: -1,
  SENSOR_FAILURE_WEIGHT: -1.0,
};
