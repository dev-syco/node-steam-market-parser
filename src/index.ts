import { httpRequest } from './utils';
import { Currency, Errors } from './const';
import { MarketHistogramData, MarketItemData, MarketPriceOverview, SteamMarketParserOptions } from './interface';

export class SteamMarketParser {
  public options: SteamMarketParserOptions = {
    currency: Currency.USD,
    appId: 730
  };

  public constructor(options: SteamMarketParserOptions = {}) {
    this.options = { ...this.options, ...options };
  }

  public async getMarketData(itemName: string, appId = this.options.appId, options = {
    proxy: this.options.proxy
  }): Promise<MarketItemData> {
    const path = `/market/listings/${ appId }/${ escape(itemName) }`;
    const response = await SteamMarketParser.request({ path, ...options });
    const result: any = {
      itemNameId: { value: '', regExp: /Market_LoadOrderSpread\((.*[0-9]?)\)/ },
      priceHistory: { value: '', regExp: /var line1=\[(.*)\]/ },
      icon: { value: '', regExp: /https\:\/\/.*\/economy\/image\/(.*)\// },
    };

    Object.keys(result).forEach((key) => {
      try {
        result[ key ].value = (this.parseSteamCommunityItemPage(response, result[ key ].regExp) || [])[ 1 ];
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

  public getOrderHistogram(itemNameId: string | number, options = {
    country: 'EN',
    language: 'english',
    currency: Currency.USD,
    proxy: this.options.proxy
  }): Promise<MarketHistogramData> {
    const params = {
      item_nameid: itemNameId,
      norender: 1,
      ...options
    };
    const path = `/market/itemordershistogram`;

    return SteamMarketParser.request({ path, json: true, params, proxy: this.options.proxy });
  }

  public getPriceOverview(itemName: string, options = {
    appid: this.options.appId,
    currency: this.options.currency,
    proxy: this.options.proxy
  }): Promise<MarketPriceOverview> {
    const params = {
      market_hash_name: escape(itemName),
      ...options
    };
    const path = `/market/priceoverview`;

    return SteamMarketParser.request({ path, json: true, params, proxy: this.options.proxy });
  }

  private parseSteamCommunityItemPage(page: string, regEx: RegExp) {
    return page.match(regEx);
  }

  private static parsePriceHistory(data: string) {
    try {
      return JSON.parse(`[${ data }]`);
    } catch (e) {
      throw new Error(`${ Errors.PRICE_HISTORY_PARSE_ERROR }: ${ e }`);
    }
  }

  private static request({ path, json, params, proxy }: { path: string, json?: boolean, params?: object, proxy?: string }) {
    return httpRequest({ path, json, proxy, hostname: 'steamcommunity.com', port: 443, method: 'GET', params });
  }
}

export { Currency, MarketItemData, MarketPriceOverview, MarketHistogramData };

export default SteamMarketParser;
