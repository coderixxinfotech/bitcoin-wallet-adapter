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
const material_1 = require("@mui/material");
const rx_1 = require("react-icons/rx");
const WalletModal = ({ open, handleClose, wallets, lastWallet, setWallet, doOpenAuth, getAddress, getAddressOptions, getUnisatAddress, modalContainerClass = "bwa-bg-black bwa-bg-opacity-75 bwa-h-screen bwa-w-full bwa_center", modalContentClass = "bwa-bg-bwa_secondary bwa-p-6 bwa-min-w-[50%] bwa-relative bwa-shadow-xl bwa-rounded-xl", closeButtonClass = "bwa-rounded bwa_font-bold bwa-bg-gray-700 hover:bwa-bg-red-500 bwa-bg-opacity-50 bwa-text-gray-300 bwa-p-2 bwa-cursor-pointer", headingClass = "bwa_modalHeading bwa-text-bwa_accent", walletItemClass = "bwa-w-full bwa-cursor-pointer bwa-border bwa-border-transparent bwa-p-4 bwa-rounded-xl bwa-transition-all", walletImageClass = "bwa-w-[50px]", walletLabelClass = "bwa-text-white bwa-font-bold bwa-capitalize bwa-text-xl bwa-pl-3 bwa-text-center", }) => {
    return (react_1.default.createElement(material_1.Modal, { open: open, onClose: handleClose, "aria-labelledby": "modal-modal-title", "aria-describedby": "modal-modal-description" },
        react_1.default.createElement("div", { className: modalContainerClass },
            react_1.default.createElement("div", { className: modalContentClass },
                react_1.default.createElement("div", { className: "bwa-absolute bwa-right-5 bwa-top-5" },
                    react_1.default.createElement("div", { className: closeButtonClass, onClick: handleClose },
                        react_1.default.createElement(rx_1.RxCross1, null))),
                react_1.default.createElement("p", { className: headingClass }, "Connect your wallet"),
                react_1.default.createElement("hr", { className: "bwa-w-5/12 bwa-bg-accent bwa-mb-8" }),
                react_1.default.createElement("div", { className: "modalBody" },
                    react_1.default.createElement("div", { className: "bwa-flex bwa-flex-wrap bwa-items-center bwa-justify-around" }, wallets.map((item, idx) => (react_1.default.createElement("div", { onClick: (e) => __awaiter(void 0, void 0, void 0, function* () {
                            const selectedItem = item.label;
                            if (selectedItem === "Leather") {
                                doOpenAuth();
                                setWallet(item.label);
                            }
                            else if (selectedItem === "Xverse") {
                                yield getAddress(getAddressOptions);
                            }
                            else if (selectedItem === "Unisat") {
                                yield getUnisatAddress();
                            }
                        }), key: item.label + idx, className: walletItemClass },
                        react_1.default.createElement("div", { className: "bwa-flex bwa-items-center bwa-p-3" },
                            react_1.default.createElement("div", { className: "bwa_center" },
                                react_1.default.createElement("img", { className: walletImageClass, src: item.logo, alt: `${item.label} logo` })),
                            react_1.default.createElement("h5", { className: walletLabelClass }, item.label + " wallet")))))))))));
};
exports.default = WalletModal;