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
  assets?: {
    descriptions: { type: string, value: string, color?: string }[],
    actions: { link: string, name: string }[],
    type: string,
    name_color: string,
    name: string,
    market_hash_name: string
  }
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
  sell_order_table?: OrderTableItem[];
  buy_order_count: string;
  buy_order_price: string;
  buy_order_table?: OrderTableItem[];
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

export interface MarketPriceHistory {
  success: 0 | 1;
  price_prefix: string;
  price_suffix: string;
  prices: PriceHistoryItem[]
}

export type AppId = number | string;

export interface SteamMarketParserOptions {
  currency: Currency | number;
  appId: AppId;
  country?: string;
  language?: string;
  proxy?: string | HttpsProxyAgentOptions;
  cookie?: string;
  headers?: Record<string, string | number | boolean>
}

export interface HttpRequestParams {
  hostname: string;
  port: number;
  path: string;
  method: 'GET' | 'POST';
  params?: object;
  json?: boolean;
  proxy?: string | HttpsProxyAgentOptions;
  headers?: Record<string, string>
}

export interface PriceOverviewParams {
  query: {
    appid: AppId;
    currency: Currency | number;
    language?: string;
  };
  headers?: Record<string, string | number | boolean>
  proxy?: string | HttpsProxyAgentOptions;
}

export interface PriceHistoryParams {
  query: {
    appid: AppId;
  };
  headers?: Record<string, string | number | boolean>
  proxy?: string | HttpsProxyAgentOptions;
}

export interface OrderHistogramParams {
  query: {
    language?: string;
    country?: string;
    currency: Currency | number;
    norender?: number;
  };
  headers?: Record<string, string | number | boolean>
  proxy?: string | HttpsProxyAgentOptions;
}

export interface MarketDataParams {
  appId: AppId;
  proxy?: string | HttpsProxyAgentOptions;
  query: {
    l?: string;
  };
}

export interface ListingParams {
  appId: AppId;
  proxy?: string | HttpsProxyAgentOptions;
  query: {
    language?: string;
    currency?: Currency;
    count?: number;
    start?: number;
  };
  headers?: Record<string, string>
}


export interface ListingData {
  success: boolean;
  start: number;
  pagesize: number;
  total_count: number;
  results_html: string;
  listinginfo: {
    [listingid: string]: {
      listingid: string;
      price: number;
      fee: number;
      publisher_fee_app: number;
      publisher_fee_percent: string;
      currencyid: number;
      steam_fee: number;
      publisher_fee: number;
      converted_price: number;
      converted_fee: number;
      converted_currencyid: number;
      converted_steam_fee: number;
      converted_publisher_fee: number;
      converted_price_per_unit: number;
      converted_fee_per_unit: number;
      converted_steam_fee_per_unit: number;
      converted_publisher_fee_per_unit: number;
      asset: {
        currency: number;
        appid: number;
        contextid: string;
        id: string;
        amount: string;
        market_actions: {
          link: string;
          name: string;
        }[];
      };
    };
  };
  assets: {
    [appid: number]: {
      [contextid: string]: {
        [id: string]: {
          currency: number;
          appid: number;
          contextid: string;
          id: string;
          classid: string;
          instanceid: string;
          amount: string;
          status: number;
          original_amount: string;
          unowned_id: string;
          unowned_contextid: string;
          background_color: string;
          icon_url: string;
          icon_url_large: string;
          descriptions: {
            type: string;
            value: string;
            color?: string;
          }[];
          tradable: number;
          actions: {
            link: string;
            name: string;
          }[];
          name: string;
          name_color: string;
          type: string;
          market_name: string;
          market_hash_name: string;
          market_actions: {
            link: string;
            name: string;
          }[];
          commodity: number;
          market_tradable_restriction: number;
          marketable: number;
          app_icon: string;
          owner: number;
        };
      };
    };
  };
  currency: []
  hovers: string;
  app_data: {
    [appid: number]: {
      appid: number;
      name: string;
      icon: string;
      link: string;
    };
  };
}
