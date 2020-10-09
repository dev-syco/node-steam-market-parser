"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = exports.SteamMarketParser = void 0;
var utils_1 = require("./utils");
var const_1 = require("./const");
Object.defineProperty(exports, "Currency", { enumerable: true, get: function () { return const_1.Currency; } });
var SteamMarketParser = /** @class */ (function () {
    function SteamMarketParser(options) {
        if (options === void 0) { options = {}; }
        this.options = {
            currency: const_1.Currency.USD,
            appId: 730
        };
        this.options = __assign(__assign({}, this.options), options);
    }
    SteamMarketParser.prototype.getMarketData = function (itemName, appId, options) {
        if (appId === void 0) { appId = this.options.appId; }
        if (options === void 0) { options = {
            proxy: this.options.proxy
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var path, response, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "/market/listings/" + appId + "/" + escape(itemName);
                        return [4 /*yield*/, SteamMarketParser.request(__assign({ path: path }, options))];
                    case 1:
                        response = _a.sent();
                        result = {
                            itemNameId: { value: '', regExp: /Market_LoadOrderSpread\((.*[0-9]?)\)/ },
                            priceHistory: { value: '', regExp: /var line1=\[(.*)\]/ },
                            icon: { value: '', regExp: /https\:\/\/.*\/economy\/image\/(.*)\// },
                        };
                        Object.keys(result).forEach(function (key) {
                            try {
                                result[key].value = (_this.parseSteamCommunityItemPage(response, result[key].regExp) || [])[1];
                            }
                            catch (e) {
                                throw new Error(const_1.Errors.PAGE_PARSING_ERROR + " - " + key + ": " + e);
                            }
                        });
                        return [2 /*return*/, {
                                itemNameId: result.itemNameId.value && Number(result.itemNameId.value),
                                icon: result.icon.value,
                                priceHistory: result.priceHistory.value && SteamMarketParser.parsePriceHistory(result.priceHistory.value),
                            }];
                }
            });
        });
    };
    SteamMarketParser.prototype.getOrderHistogram = function (itemNameId, options) {
        if (options === void 0) { options = {
            country: 'EN',
            language: 'english',
            currency: const_1.Currency.USD,
            proxy: this.options.proxy
        }; }
        var params = __assign({ item_nameid: itemNameId, norender: 1 }, options);
        var path = "/market/itemordershistogram";
        return SteamMarketParser.request({ path: path, json: true, params: params, proxy: this.options.proxy });
    };
    SteamMarketParser.prototype.getPriceOverview = function (itemName, options) {
        if (options === void 0) { options = {
            appid: this.options.appId,
            currency: this.options.currency,
            proxy: this.options.proxy
        }; }
        var params = __assign({ market_hash_name: escape(itemName) }, options);
        var path = "/market/priceoverview";
        return SteamMarketParser.request({ path: path, json: true, params: params, proxy: this.options.proxy });
    };
    SteamMarketParser.prototype.parseSteamCommunityItemPage = function (page, regEx) {
        return page.match(regEx);
    };
    SteamMarketParser.parsePriceHistory = function (data) {
        try {
            return JSON.parse("[" + data + "]");
        }
        catch (e) {
            throw new Error(const_1.Errors.PRICE_HISTORY_PARSE_ERROR + ": " + e);
        }
    };
    SteamMarketParser.request = function (_a) {
        var path = _a.path, json = _a.json, params = _a.params, proxy = _a.proxy;
        return utils_1.httpRequest({ path: path, json: json, proxy: proxy, hostname: 'steamcommunity.com', port: 443, method: 'GET', params: params });
    };
    return SteamMarketParser;
}());
exports.SteamMarketParser = SteamMarketParser;
exports.default = SteamMarketParser;
