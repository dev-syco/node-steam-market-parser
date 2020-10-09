import { Currency } from './const';
import { MarketHistogramData, MarketItemData, MarketPriceOverview, SteamMarketParserOptions } from './interface';
export declare class SteamMarketParser {
    options: SteamMarketParserOptions;
    constructor(options?: SteamMarketParserOptions);
    getMarketData(itemName: string, appId?: string | number | undefined, options?: {
        proxy: string | undefined;
    }): Promise<MarketItemData>;
    getOrderHistogram(itemNameId: string | number, options?: {
        country: string;
        language: string;
        currency: Currency;
        proxy: string | undefined;
    }): Promise<MarketHistogramData>;
    getPriceOverview(itemName: string, options?: {
        appid: string | number | undefined;
        currency: number | undefined;
        proxy: string | undefined;
    }): Promise<MarketPriceOverview>;
    private parseSteamCommunityItemPage;
    private static parsePriceHistory;
    private static request;
}
export { Currency, MarketItemData, MarketPriceOverview, MarketHistogramData };
export default SteamMarketParser;
