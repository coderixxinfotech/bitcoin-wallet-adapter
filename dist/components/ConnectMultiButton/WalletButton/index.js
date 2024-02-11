"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const CustomButton_1 = __importDefault(require("../../CustomButton"));
const utils_1 = require("../../../utils");
const ri_1 = require("react-icons/ri");
const fa_1 = require("react-icons/fa");
const material_1 = require("@mui/material");
const WalletButton = ({ wallets, lastWallet, walletDetails, handleMenuOpen, handleMenuClose, handleOpen, handleClose, disconnect, anchorEl, menuOpen, classname, InnerMenu, balance, }) => {
    return lastWallet && walletDetails ? (react_1.default.createElement("div", { className: "relative" },
        react_1.default.createElement(CustomButton_1.default, { icon: ri_1.RiAccountCircleFill, text: `${balance
                ? `${(balance / 100000000).toFixed(5)} BTC`
                : (0, utils_1.shortenString)(walletDetails.cardinal, 5)}`, onClick: (e) => (menuOpen ? handleMenuClose() : handleMenuOpen(e)), className: classname }),
        InnerMenu ? (react_1.default.createElement(InnerMenu, { anchorEl: anchorEl, open: menuOpen, onClose: handleMenuClose, disconnect: disconnect })) : (react_1.default.createElement(material_1.Menu, { id: "connected-menu", anchorEl: anchorEl, open: menuOpen, onClose: handleMenuClose, PaperProps: {
                elevation: 0,
                sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                    },
                },
            }, MenuListProps: {
                "aria-labelledby": "basic-button",
            }, transformOrigin: { horizontal: "right", vertical: "top" }, anchorOrigin: { horizontal: "right", vertical: "bottom" } },
            react_1.default.createElement("div", null,
                react_1.default.createElement(material_1.MenuItem, { onClick: disconnect, className: "bwa-flex" },
                    react_1.default.createElement(fa_1.FaPowerOff, null),
                    react_1.default.createElement("p", { className: "bwa-ml-2 bwa-text-xs" }, "Disconnect"))))))) : (react_1.default.createElement(CustomButton_1.default
    // disabled={wallets?.length === 0 ? true : false}
    , { 
        // disabled={wallets?.length === 0 ? true : false}
        icon: fa_1.FaWallet, text: "Connect Wallet", onClick: handleOpen, className: classname }));
};
exports.default = WalletButton;
