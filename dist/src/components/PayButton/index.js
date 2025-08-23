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
const react_1 = __importDefault(require("react"));
const CustomButton_1 = __importDefault(require("../CustomButton"));
const utils_1 = require("../../utils");
const fa_1 = require("react-icons/fa");
const react_redux_1 = require("react-redux");
const sats_connect_1 = require("sats-connect");
const errorHandler_1 = require("../../utils/errorHandler");
function PayButton({ amount, receipient, buttonClassname, }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const lastWallet = (0, react_redux_1.useSelector)((state) => state.general.lastWallet);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            e.preventDefault();
            if (!(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.connected)) {
                (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_CONNECTED, "No wallet is currently connected. Please connect a wallet to make payments.", {
                    severity: errorHandler_1.BWAErrorSeverity.HIGH,
                    context: {
                        operation: 'btc_payment',
                        additionalData: { amount, receipient }
                    }
                });
            }
            if (lastWallet === "Leather") {
                //@ts-ignore
                const resp = yield ((_a = window.btc) === null || _a === void 0 ? void 0 : _a.request("sendTransfer", {
                    address: receipient,
                    amount,
                }));
                const txid = resp === null || resp === void 0 ? void 0 : resp.id;
                return txid;
            }
            else if (lastWallet === "Xverse") {
                const sendBtcOptions = {
                    payload: {
                        network: {
                            type: "Mainnet",
                        },
                        recipients: [
                            {
                                address: receipient,
                                amountSats: amount,
                            },
                        ],
                        senderAddress: walletDetails.cardinal,
                    },
                    onFinish: (response) => {
                        return response;
                    },
                    onCancel: () => {
                        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.USER_REJECTED, "Payment was cancelled by the user.", {
                            severity: errorHandler_1.BWAErrorSeverity.LOW,
                            recoverable: true,
                            context: {
                                operation: 'btc_payment',
                                walletType: 'Xverse'
                            }
                        });
                    },
                };
                //@ts-ignore
                return yield (0, sats_connect_1.sendBtcTransaction)(sendBtcOptions);
            }
            else if (lastWallet === "Unisat") {
                //@ts-ignore
                let txid = yield window.unisat.sendBitcoin(receipient, amount);
                return txid;
            }
            else {
                (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.UNSUPPORTED_WALLET, `${lastWallet} wallet does not support BTC payments yet.`, {
                    severity: errorHandler_1.BWAErrorSeverity.HIGH,
                    context: {
                        operation: 'btc_payment',
                        walletType: lastWallet
                    }
                });
            }
        }
        catch (e) {
            // BWA errors are already handled by the error manager
            // Re-throw to let the system handle them properly
            throw e;
        }
    });
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(CustomButton_1.default, { icon: fa_1.FaBtc, text: `Pay ${(0, utils_1.convertSatToBtc)(amount)} BTC`, onClick: (e) => handleSubmit(e), className: buttonClassname })));
}
exports.default = PayButton;
