import SteamMarketParser, {
  Currency,
  ListingData,
  MarketHistogramData,
  MarketItemData,
  MarketPriceOverview
} from '../src';
import { expect } from 'chai';

describe('Base tests', () => {
  const parser = new SteamMarketParser({ appId: 570, currency: Currency.EUR, cookie: ' ' });
  let priceOverview: MarketPriceOverview;
  let marketData: MarketItemData;
  let listingData: ListingData;
  let orderHistogram: MarketHistogramData;
  let errorTest: any;
  let marketPriceHistory: any;

  before(async function() {
    this.timeout(30000)
    priceOverview = await parser.getPriceOverview('Flight of Epiphany');
    parser.options.appId = 730;
    parser.options.currency = Currency.USD;
    const requests: Promise<any>[] = [
      parser.getMarketData('Five-SeveN | Hyper Beast (Field-Tested)'),
      parser.getListing('Five-SeveN | Hyper Beast (Field-Tested)'),
      parser.getMarketData('some random string to text exception')
    ];
    const responses = await Promise.all(requests)
    marketData = responses[0]
    listingData = responses[1]
    errorTest = responses[2]
    marketPriceHistory = await parser.getPriceHistory('175896289').catch(e => {
      return null
    });
    if (marketData.itemNameId) {
      orderHistogram = await parser.getOrderHistogram(marketData.itemNameId);
    }
  });

  it('Price overview', () => {
    expect(priceOverview.success).to.eql(true);
  });

  it('Price overview currency', () => {
    expect(priceOverview.lowest_price.indexOf('€') >= 0).to.eql(true);
  });

  it('Market data', () => {
    expect(marketData.itemNameId).is.not.undefined;
  });

  it('Order histogram', () => {
    expect(orderHistogram.success).to.eql(1);
  });

  it('Item listing', () => {
    expect(listingData.success).to.eql(true);
  });

  it('Price history', () => {
    expect(marketPriceHistory).to.eql(null);
  });

  it('Exception test', () => {
    expect(errorTest).to.eql({ itemNameId: undefined, icon: '', priceHistory: undefined, assets: undefined }
    );
  });
});
