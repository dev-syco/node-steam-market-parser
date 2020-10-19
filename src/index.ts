import { httpRequest, parseMarketData } from './utils';
import { Currency } from './const';
import { HttpsProxyAgentOptions } from 'https-proxy-agent';
import { MarketDataParams, MarketHistogramData, MarketItemData, MarketPriceOverview, OrderHistogramParams, PriceOverviewParams, SteamMarketParserOptions } from './interface';

export class SteamMarketParser {
  public options: SteamMarketParserOptions = {
    country: 'EN',
    language: 'english',
    currency: Currency.USD,
    appId: 730,
  };

  public constructor(options?: SteamMarketParserOptions) {
    this.options = { ...this.options, ...(options || {}) };
  }

  public getMarketData(itemName: string): Promise<MarketItemData> {
    return SteamMarketParser.getMarketData(itemName, { appId: this.options.appId, proxy: this.options.proxy });
  }

  public getOrderHistogram(itemNameId: string | number): Promise<MarketHistogramData> {
    const params = {
      query: {
        country: this.options.country,
        language: this.options.language,
        currency: this.options.currency,
      },
      proxy: this.options.proxy,
    };

    return SteamMarketParser.getOrderHistogram(itemNameId, params);
  }

  public getPriceOverview(itemName: string) {
    return SteamMarketParser.getPriceOverview(itemName, {
      query: {
        appid: this.options.appId,
        currency: this.options.currency,
      },
      proxy: this.options.proxy,
    });
  }

  public static async getMarketData(itemName: string, options: MarketDataParams): Promise<MarketItemData> {
    const path = `/market/listings/${ options.appId }/${ encodeURI(itemName) }`;
    const response = await SteamMarketParser.request({ path, proxy: options.proxy });

    return parseMarketData(response);
  }

  public static getOrderHistogram(itemNameId: string | number, options: OrderHistogramParams): Promise<MarketHistogramData> {
    const params = {
      item_nameid: itemNameId,
      norender: 1,
      ...options.query,
    };
    const path = `/market/itemordershistogram`;

    return SteamMarketParser.request({ path, json: true, params, proxy: options.proxy });
  }

  public static getPriceOverview(itemName: string, options: PriceOverviewParams): Promise<MarketPriceOverview> {
    const params = {
      market_hash_name: escape(itemName),
      ...options.query,
    };
    const path = `/market/priceoverview`;

    return SteamMarketParser.request({ path, json: true, params, proxy: options.proxy });
  }

  private static request({ path, json, params, proxy }: { path: string, json?: boolean, params?: object, proxy?: string | HttpsProxyAgentOptions }) {
    return httpRequest({ path, json, proxy, hostname: 'steamcommunity.com', port: 443, method: 'GET', params });
  }
}

export * from './interface';
export * from './const';

export default SteamMarketParser;
