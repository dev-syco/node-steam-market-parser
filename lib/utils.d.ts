import { HttpRequestParams } from './interface';
export declare function httpRequest({ hostname, port, path, json, proxy, method, params }: HttpRequestParams): Promise<string | any>;
