export enum Errors {
  PARSING_ERROR = 'Error while parsing',
  PRICE_HISTORY_PARSE_ERROR = 'Error while parsing price history page',
  ASSETS_PARSE_ERROR = 'Error while parsing assets data',
  PAGE_PARSING_ERROR = 'Error while parsing steamcommunity page',
  PROXY_CONNECTION_ERROR = 'Proxy connection error',
}

export enum Currency {
  USD = 1,
  GBP = 2,
  EUR = 3,
  CHF = 4,
  RUB = 5,
  PLN = 6,
  BRL = 7,
  JPY = 8,
  SEK = 9,
  IDR = 10,
  MYR = 11,
  PHP = 12,
  SGD = 13,
  THB = 14,
  VND = 15,
  KRW = 16,
  TRY = 17,
  UAH = 18,
  MXN = 19,
  CAD = 20,
  AUD = 21,
  NZD = 22,
  CNY = 23,
  INR = 24,
  CLP = 25,
  PEN = 26,
  COP = 27,
  ZAR = 28,
  HKD = 29,
  TWD = 30,
  SRD = 31,
  AED = 32,
  ARS = 34,
  ILS = 35,
  KZT = 37,
  KWD = 38,
  QAR = 39,
  CRC = 40,
  UYU = 41,
}

export const GOOD_RESPONSE_STATUS_CODE = 200;
