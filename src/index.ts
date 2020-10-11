import { httpRequest } from './utils';
import { Currency, Errors } from './const';
import { HttpsProxyAgentOptions } from 'https-proxy-agent';
import { MarketDataParams, MarketHistogramData, MarketItemData, MarketPriceOverview, OrderHistogramParams, PriceOverviewParams, SteamMarketParserOptions } from './interface';

export class SteamMarketParser {
  public options: SteamMarketParserOptions = {
    currency: Currency.USD,
    appId: 730
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
        country: 'EN',
        language: 'english',
        currency: Currency.USD,
      },
      proxy: this.options.proxy
    };

    return SteamMarketParser.getOrderHistogram(itemNameId, params);
  }

  public getPriceOverview(itemName: string) {
    return SteamMarketParser.getPriceOverview(itemName, {
      query: {
        appid: this.options.appId,
        currency: this.options.currency,
      },
      proxy: this.options.proxy
    });
  }

  public static async getMarketData(itemName: string, options: MarketDataParams): Promise<MarketItemData> {
    const path = `/market/listings/${ options.appId }/${ escape(itemName) }`;
    const response = await SteamMarketParser.request({ path, proxy: options.proxy });
    const result: any = {
      itemNameId: { value: '', regExp: /Market_LoadOrderSpread\((.*[0-9]?)\)/ },
      priceHistory: { value: '', regExp: /var line1=\[(.*)\]/ },
      icon: { value: '', regExp: /https\:\/\/.*\/economy\/image\/(.*)\// },
    };

    Object.keys(result).forEach((key) => {
      try {
        result[ key ].value = (SteamMarketParser.parseSteamCommunityItemPage(response, result[ key ].regExp) || [])[ 1 ];
      } catch (e) {
        throw new Error(`${ Errors.PAGE_PARSING_ERROR } - ${ key }: ${ e }`);
      }
    });

    return {
      itemNameId: result.itemNameId.value && Number(result.itemNameId.value),
      icon: result.icon.value,
      priceHistory: result.priceHistory.value && SteamMarketParser.parsePriceHistory(result.priceHistory.value),
    };
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
      market_hash_name: escape(itemName),
      ...options.query
    };
    const path = `/market/priceoverview`;

    return SteamMarketParser.request({ path, json: true, params, proxy: options.proxy });
  }

  private static parseSteamCommunityItemPage(page: string, regEx: RegExp) {
    return page.match(regEx);
  }

  private static parsePriceHistory(data: string) {
    try {
      return JSON.parse(`[${ data }]`);
    } catch (e) {
      throw new Error(`${ Errors.PRICE_HISTORY_PARSE_ERROR }: ${ e }`);
    }
  }

  private static request({ path, json, params, proxy }: { path: string, json?: boolean, params?: object, proxy?: string | HttpsProxyAgentOptions }) {
    return httpRequest({ path, json, proxy, hostname: 'steamcommunity.com', port: 443, method: 'GET', params });
  }
}

export { Currency, MarketItemData, MarketPriceOverview, MarketHistogramData };

export default SteamMarketParser;
