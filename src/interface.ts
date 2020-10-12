import { HttpsProxyAgentOptions } from 'https-proxy-agent';

import { Currency } from './const';

/* Date, price, count */
export type PriceHistoryItem = [ string, number, string ];

/* Price, count, description */
export type HistogramGraphItem = [ number, number, string ];

export interface MarketItemData {
  itemNameId?: number;
  icon?: string;
  priceHistory?: PriceHistoryItem[];
}

export interface MarketPriceOverview {
  success: boolean;
  lowest_price: string;
  volume: string;
  median_price: string;
}

export interface OrderTableItem {
  price: string;
  price_with_fee?: string;
  quantity: string;
}

export interface MarketHistogramData {
  success: 0 | 1;
  sell_order_count: string;
  sell_order_price: string;
  sell_order_table: OrderTableItem[];
  buy_order_count: string;
  buy_order_price: string;
  buy_order_table: OrderTableItem[];
  highest_buy_order: string;
  lowest_sell_order: string;
  buy_order_graph: HistogramGraphItem[];
  sell_order_graph: HistogramGraphItem[];
  graph_max_y: number;
  graph_min_x: number;
  graph_max_x: number;
  price_prefix: string;
  price_suffix: string;
}

type AppId = number | string;

export interface SteamMarketParserOptions {
  currency: Currency | number;
  appId: AppId;
  proxy?: string | HttpsProxyAgentOptions;
}

export interface HttpRequestParams {
  hostname: string;
  port: number;
  path: string;
  method: 'GET' | 'POST';
  params?: object;
  json?: boolean;
  proxy?: string | HttpsProxyAgentOptions;
}

export interface PriceOverviewParams {
  query: {
    appid: AppId;
    currency: Currency | number;
  }
  proxy?: string | HttpsProxyAgentOptions;
}

export interface OrderHistogramParams {
  query: {
    language: string;
    country: string;
    currency: Currency | number;
  };
  proxy?: string | HttpsProxyAgentOptions;
}

export interface MarketDataParams {
  appId: AppId;
  proxy?: string | HttpsProxyAgentOptions;
}
