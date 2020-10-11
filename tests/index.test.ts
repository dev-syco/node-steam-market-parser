import SteamMarketParser, { Currency, MarketHistogramData, MarketItemData, MarketPriceOverview } from '../src';
import { expect } from 'chai';

describe('Base tests', () => {
  const parser = new SteamMarketParser({ appId: 570, currency: Currency.EUR });
  let priceOverview: MarketPriceOverview;
  let marketData: MarketItemData;
  let orderHistogram: MarketHistogramData;
  let errorTest: any;

  before(async () => {
    priceOverview = await parser.getPriceOverview('Flight of Epiphany');
    parser.options.appId = 730;
    parser.options.currency = Currency.USD;
    marketData = await parser.getMarketData('Five-SeveN | Hyper Beast (Field-Tested)');
    errorTest = await parser.getMarketData('some random string to text exception');

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

  it('Exception test', () => {
    expect(errorTest).to.eql({ itemNameId: undefined, icon: '', priceHistory: undefined }
    );
  });
});
