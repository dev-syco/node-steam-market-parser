import { HistogramGraphItem, HttpRequestParams, OrderTableItem } from './interface';
import { IncomingMessage, RequestOptions } from 'http';
import { Errors, GOOD_RESPONSE_STATUS_CODE } from './const';
import { request } from 'https';
import HttpsProxyAgent from 'https-proxy-agent';
import * as zlib from 'zlib';

export function httpRequest({ hostname, port, path, json, proxy, method, params, headers }: HttpRequestParams): Promise<string | any> {
  return new Promise(async (res, rej) => {
    const paramsOrder = ['country', 'language', 'currency', 'item_nameid', 'two_factor', 'appid', 'market_hash_name'];
    const stringedParams =  Object.keys(params || {})
      .sort((a, b) => paramsOrder.indexOf(a) - paramsOrder.indexOf(b))
      // @ts-ignore
      .map((param) => `${param}=${params[param]}`)
      .join('&');

    if (stringedParams) {
      path = `${path}?${stringedParams}`;
    }
    const options: RequestOptions = {
      hostname,
      port,
      method,
      path,
      headers
    };

    if (proxy) {
      options.agent = HttpsProxyAgent(proxy);
    }

    const req = request(options, (response: IncomingMessage) => {
      if (response.statusCode === GOOD_RESPONSE_STATUS_CODE) {
        const contentEncoding = response.headers['content-encoding'];
        const body: any = [];

        const handleResponseData = (chunk: any) => {
          body.push(chunk);
        };

        // Handle content compression based on 'content-encoding' header
        switch (contentEncoding) {
          case 'gzip':
            const gzip = zlib.createGunzip();
            response.pipe(gzip);
            gzip.on('data', handleResponseData);
            gzip.on('end', () => {
              res(normalizeBody(body, json));
            });
            break;
          case 'deflate':
            const deflate = zlib.createInflate();
            response.pipe(deflate);
            deflate.on('data', handleResponseData);
            deflate.on('end', () => {
              res(normalizeBody(body, json));
            });
            break;
          case 'br':
            const brotli = zlib.createBrotliDecompress();
            response.pipe(brotli);
            brotli.on('data', handleResponseData);
            brotli.on('end', () => {
              res(normalizeBody(body, json));
            });
            break;
          default:
            response.on('data', handleResponseData);
            response.on('end', () => {
              res(normalizeBody(body, json));
            });
            break;
        }
      } else {
        rej({ statusCode: response.statusCode, message: response.statusMessage });
      }
    });

    req.on('error', (e) => {
      rej(e);
    });

    req.end();
  });
}

function normalizeBody(body: any, json = false) {
  const data = Buffer.concat(body).toString();
  ;
  if (json) {
    try {
      return JSON.parse(data);
    } catch (e) {
      throw new Error(`${Errors.PARSING_ERROR}: ${e}`);
    }
  } else {
    return data;
  }
}

export function parseSteamCommunityItemPage(page: string, regEx: RegExp) {
  return page.match(regEx);
}

export function parsePriceHistory(data: string) {
  try {
    return JSON.parse(`[${data}]`);
  } catch (e) {
    throw new Error(`${Errors.PRICE_HISTORY_PARSE_ERROR}: ${e}`);
  }
}

export function parseAssetsJSON(data: string) {
  try {
    data = data.replace(/(\r\n|\n|\r)/gm, '');
    const assets = JSON.parse(`{${data}}`);
    const appId = Object.keys(assets)[0];
    const contextId = Object.keys(assets[appId])[0];
    const firstAvailableItemId = Object.keys(assets[appId][contextId])[0];
    const firstAvailableItem = assets[appId][contextId][firstAvailableItemId];
    const { descriptions, actions, type, name_color, name, market_hash_name } = firstAvailableItem || {};

    return { descriptions, actions, type, name_color, name, market_hash_name };
  } catch (e) {
    throw new Error(`${Errors.ASSETS_PARSE_ERROR}: ${e}`);
  }
}

export function parseMarketData(page: string) {
  const result: any = {
    itemNameId: { value: '', regExp: /Market_LoadOrderSpread\((.*[0-9]?)\)/ },
    priceHistory: { value: '', regExp: /var line1=\[(.*)\]/ },
    assets: { value: '', regExp: /var g_rgAssets = \{(.*)\}/ },
    icon: { value: '', regExp: /https\:\/\/.*\/economy\/image\/(.*)\// }
  };

  Object.keys(result).forEach((key) => {
    try {
      result[key].value = (parseSteamCommunityItemPage(page, result[key].regExp) || [])[1];
    } catch (e) {
      throw new Error(`${Errors.PAGE_PARSING_ERROR} - ${key}: ${e}`);
    }
  });

  return {
    itemNameId: result.itemNameId.value && Number(result.itemNameId.value),
    icon: result.icon.value,
    assets: result.assets.value && parseAssetsJSON(result.assets.value),
    priceHistory: result.priceHistory.value && parsePriceHistory(result.priceHistory.value)
  };
}

function extractOrdersSummary(htmlString: any) {
  const valueRegex = /<span class="market_commodity_orders_header_promote">([^<]+)<\/span>/g;

  let matches;
  const values = [];

  // tslint:disable-next-line:no-conditional-assignment
  while ((matches = valueRegex.exec(htmlString)) !== null) {
    values.push(matches[1]);
  }

  return values;
}

export function parseNoRenderOrderHistogramResponse(data: any) {
  const {
    highest_buy_order,
    lowest_sell_order,
    buy_order_graph,
    sell_order_graph,
    graph_max_y,
    graph_min_x,
    graph_max_x,
    price_prefix,
    price_suffix,
    sell_order_summary,
    success,
  } = data;
  // tslint:disable-next-line:variable-name
  const [sell_order_count, sell_order_price] = extractOrdersSummary(sell_order_summary);
  // tslint:disable-next-line:variable-name
  const [buy_order_count, buy_order_price] = extractOrdersSummary(sell_order_summary);
  return {
    success,
    sell_order_count,
    sell_order_price,
    buy_order_count,
    buy_order_price,
    highest_buy_order,
    lowest_sell_order,
    buy_order_graph,
    sell_order_graph,
    graph_max_y,
    graph_min_x,
    graph_max_x,
    price_prefix,
    price_suffix
  };
}