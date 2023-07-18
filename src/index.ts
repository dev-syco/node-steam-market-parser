import { httpRequest, parseMarketData } from './utils';
import { Currency, Errors } from './const';
import { HttpsProxyAgentOptions } from 'https-proxy-agent';
import {
  ListingData, ListingParams,
  MarketDataParams,
  MarketHistogramData,
  MarketItemData, MarketPriceHistory,
  MarketPriceOverview,
  OrderHistogramParams, PriceHistoryParams,
  PriceOverviewParams,
  SteamMarketParserOptions
} from './interface';

export class SteamMarketParser {
  public options: SteamMarketParserOptions = {
    country: 'US',
    language: 'english',
    currency: Currency.USD,
    appId: 730
  };

  public constructor(options?: SteamMarketParserOptions) {
    this.options = { ...this.options, ...(options || {}) };
  }

  public getMarketData(itemName: string): Promise<MarketItemData> {
    const params = {
      appId: this.options.appId,
      query: {
        l: this.options.language
      },
      proxy: this.options.proxy
    };
    return SteamMarketParser.getMarketData(itemName, params);
  }

  public getOrderHistogram(itemNameId: string | number): Promise<MarketHistogramData> {
    const params = {
      query: {
        country: this.options.country,
        language: this.options.language,
        currency: this.options.currency
      },
      proxy: this.options.proxy
    };

    return SteamMarketParser.getOrderHistogram(itemNameId, params);
  }

  public getListing(itemName: string, { start, count } = { start: 0, count: 1 }): Promise<ListingData> {
    const params = {
      appId: this.options.appId,
      query: {
        country: this.options.country,
        language: this.options.language,
        currency: this.options.currency,
        start, count
      },
      proxy: this.options.proxy
    };
    return SteamMarketParser.getListing(itemName, params);
  }

  public getPriceOverview(itemName: string) {
    return SteamMarketParser.getPriceOverview(itemName, {
      query: {
        appid: this.options.appId,
        currency: this.options.currency,
        language: this.options.language
      },
      proxy: this.options.proxy
    });
  }

  public getPriceHistory(itemName: string): Promise<MarketPriceHistory> {
    if (!this.options.cookie) {
      throw new Error(Errors.METHODS_REQUIRES_AUTHORIZATION);
    }
    return SteamMarketParser.getPriceHistory(itemName, {
      query: {
        appid: this.options.appId
      },
      proxy: this.options.proxy,
      cookie: this.options.cookie
    });
  }

  public static async getMarketData(itemName: string, options: MarketDataParams): Promise<MarketItemData> {
    const path = `/market/listings/${options.appId}/${encodeURIComponent(itemName)}`;
    const response = await SteamMarketParser.request({ path, proxy: options.proxy, params: options.query });

    return parseMarketData(response);
  }

  public static getListing(itemName: string, options: ListingParams): Promise<ListingData> {
    const params = {
      count: 1,
      currency: Currency.USD,
      language: 'english',
      ...options.query
    };
    const path = `/market/listings/${options.appId}/${encodeURIComponent(itemName)}/render`;
    return SteamMarketParser.request({ path, json: true, proxy: options.proxy, params });
  }

  public static getOrderHistogram(itemNameId: string | number, options: OrderHistogramParams): Promise<MarketHistogramData> {
    const params = {
      item_nameid: itemNameId,
      norender: 1,
      ...options.query
    };
    const path = `/market/itemordershistogram`;

    return SteamMarketParser.request({ path, json: true, params, proxy: options.proxy });
  }

  public static getPriceOverview(itemName: string, options: PriceOverviewParams): Promise<MarketPriceOverview> {
    const params = {
      market_hash_name: encodeURIComponent(itemName),
      ...options.query
    };
    const path = `/market/priceoverview`;

    return SteamMarketParser.request({ path, json: true, params, proxy: options.proxy });
  }

  public static getPriceHistory(itemName: string, options: PriceHistoryParams): Promise<MarketPriceHistory> {
    const params = {
      market_hash_name: encodeURIComponent(itemName),
      ...options.query
    };
    const path = `/market/pricehistory`;
    const headers = {
      Cookie: options.cookie
    };
    return SteamMarketParser.request({ path, json: true, params, proxy: options.proxy, headers });
  }

  private static request({ path, json, params, proxy, headers }: { path: string, json?: boolean, params?: object, proxy?: string | HttpsProxyAgentOptions, headers?: Record<string, string> }) {
    return httpRequest({ path, json, proxy, hostname: 'steamcommunity.com', port: 443, method: 'GET', params, headers });
  }
}

export * from './interface';
export * from './const';

export default SteamMarketParser;
