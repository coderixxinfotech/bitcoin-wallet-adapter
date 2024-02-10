"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countDummyUtxos = exports.isBase64 = exports.isHex = exports.hexToBase64 = exports.shortenString = exports.getBTCPriceInDollars = exports.base64ToHex = exports.convertBtcToSat = exports.convertSatToBtc = void 0;
const axios_1 = __importDefault(require("axios"));
// Function to convert price from satoshi to Bitcoin
function convertSatToBtc(priceInSat) {
    return priceInSat / 1e8; // 1 BTC = 100,000,000 SAT
}
exports.convertSatToBtc = convertSatToBtc;
// Function to convert price from satoshi to Bitcoin
function convertBtcToSat(priceInSat) {
    return priceInSat * 1e8; // 1 BTC = 100,000,000 SAT
}
exports.convertBtcToSat = convertBtcToSat;
function base64ToHex(str) {
    return atob(str)
        .split("")
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
}
exports.base64ToHex = base64ToHex;
function getBTCPriceInDollars() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://api.coindesk.com/v1/bpi/currentprice/BTC.json");
            const data = yield response.json();
            const priceInDollars = data.bpi.USD.rate_float;
            return priceInDollars;
        }
        catch (error) {
            console.error("Error fetching BTC price:", error);
            return null;
        }
    });
}
exports.getBTCPriceInDollars = getBTCPriceInDollars;
function shortenString(str, length = 4) {
    if (str.length <= 8) {
        return str;
    }
    const start = str.slice(0, length);
    const end = str.slice(-length);
    return `${start}...${end}`;
}
exports.shortenString = shortenString;
const hexToBase64 = (hexString) => {
    const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    const byteArray = Array.from(bytes);
    return btoa(String.fromCharCode.apply(null, byteArray));
};
exports.hexToBase64 = hexToBase64;
const isHex = (str) => /^[0-9a-fA-F]+$/.test(str);
exports.isHex = isHex;
const isBase64 = (str) => {
    try {
        return btoa(atob(str)) === str;
    }
    catch (err) {
        return false;
    }
};
exports.isBase64 = isBase64;
function getUtxosByAddress(address, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(`${url}/address/${address}/utxo`);
        return data;
    });
}
function doesUtxoContainInscription(utxo, url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!url) {
            // If the API URL is not set, return true as per your requirement
            console.warn("API provider URL is not defined in environment variables");
            return true;
        }
        try {
            const response = yield axios_1.default.get(`${url}/output/${utxo.txid}:${utxo.vout}`, {
                headers: {
                    Accept: "application/json",
                },
            });
            if (response.data && Array.isArray(response.data.inscriptions)) {
                return response.data.inscriptions.length > 0;
            }
            else {
                // If the data is not in the expected format, return true
                console.warn("Invalid data structure received from API");
                return true;
            }
        }
        catch (error) {
            // In case of any API error, return true
            console.error("Error in doesUtxoContainInscription:", error);
            return true;
        }
    });
}
function countDummyUtxos(address, mempool_url, ord_url) {
    return __awaiter(this, void 0, void 0, function* () {
        let counter = 0;
        const utxos = yield getUtxosByAddress(address, mempool_url);
        for (const utxo of utxos) {
            if (yield doesUtxoContainInscription(utxo, ord_url)) {
                continue;
            }
            if (utxo.value >= 580 && utxo.value <= 1000) {
                counter++;
                if (counter === 20) {
                    break;
                }
            }
        }
        return counter;
    });
}
exports.countDummyUtxos = countDummyUtxos;
