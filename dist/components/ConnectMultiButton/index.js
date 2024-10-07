"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
//xverse
const sats_connect_1 = require("sats-connect");
//reducer
const react_redux_1 = require("react-redux");
const notificationReducers_1 = require("../../stores/reducers/notificationReducers");
const generalReducer_1 = require("../../stores/reducers/generalReducer");
const WalletButton_1 = __importDefault(require("./WalletButton"));
const WalletModal_1 = __importDefault(require("./WalletModal"));
const utils_1 = require("../../utils");
const generalReducer_2 = require("../../stores/reducers/generalReducer");
// ME Wallet
const SatsConnectNamespace = "sats-connect:";
const react_2 = require("@wallet-standard/react");
const ConnectionStatus_1 = require("../../common/ConnectionStatus");
const hooks_1 = require("../../hooks");
const purposes = ["ordinals", "payment"];
function ConnectMultiWallet({ buttonClassname, modalContainerClass, modalContentClass, closeButtonClass, headingClass, walletItemClass, walletImageClass, walletLabelClass, InnerMenu, icon, iconClass, balance, network, connectionMessage, }) {
    const { loading, result, error, signMessage } = (0, hooks_1.useMessageSign)();
    //for notification
    const dispatch = (0, react_redux_1.useDispatch)();
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const redux_network = (0, react_redux_1.useSelector)((state) => state.general.network.toLowerCase());
    const lastWallet = (0, react_redux_1.useSelector)((state) => state.general.lastWallet);
    const [wallets, setWallets] = (0, react_1.useState)([]);
    const [tempWD, setTempWD] = (0, react_1.useState)(null); //hold wallet details till user signs the message
    const getMessage = (address) => {
        const issuedAt = new Date().toISOString(); // Get the current date and time in ISO format
        return `Ordinalnovus wants you to sign in with your Bitcoin account:

${address}

Welcome to Ordinalnovus. \n\nSigning is the only way we can truly know that you are the owner of the wallet you are connecting. Signing is a safe, gas-less transaction that does not in any way give Ordinalnovus permission to perform any transactions with your wallet.\n

\nURI: https://ordinalnovus.com\n\n

Version: 1\n\n

Issued At: ${issuedAt}`;
    };
    //redux wallet management
    const updateWalletDetails = (0, react_1.useCallback)((newWalletDetails) => __awaiter(this, void 0, void 0, function* () {
        dispatch((0, generalReducer_1.setWalletDetails)(newWalletDetails));
    }), [dispatch]);
    const updateLastWallet = (0, react_1.useCallback)((newLastWallet) => {
        dispatch((0, generalReducer_1.setLastWallet)(newLastWallet));
    }, [dispatch]);
    //connect-wallet modal
    const [open, setOpen] = (0, react_1.useState)(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };
    const { wallets: testWallets } = (0, react_2.useWallets)();
    const { setWallet, wallet } = (0, react_2.useWallet)();
    const connectionStatus = (0, react_1.useContext)(ConnectionStatus_1.ConnectionStatusContext);
    // ME
    (0, react_1.useEffect)(() => {
        connectOrDeselect();
    }, [wallet]);
    // Function to check which wallets are installed
    function getInstalledWalletName() {
        var _a, _b, _c;
        const checkWallets = [];
        if (typeof window.unisat !== "undefined") {
            checkWallets.push({
                label: "Unisat",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-unisat-logo.png",
            });
        }
        if (typeof window.LeatherProvider !== "undefined") {
            checkWallets.push({
                label: "Leather",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-leather-logo.png",
            });
        }
        if ((_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.BitcoinProvider) === null || _a === void 0 ? void 0 : _a.signTransaction) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.includes("Psbt")) {
            checkWallets.push({
                label: "Xverse",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-xverse-logo.png",
            });
        }
        if (typeof window.magicEden !== "undefined")
            checkWallets.push({
                label: "MagicEden",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-magiceden-logo.png",
            });
        if (typeof window.phantom !== "undefined") {
            checkWallets.push({
                label: "Phantom",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-phantom-logo.png",
            });
        }
        if (typeof window.okxwallet !== "undefined") {
            checkWallets.push({
                label: "OKX",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-okx-logo.png",
            });
        }
        setWallets(checkWallets);
    }
    const getBTCPrice = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        const price = yield (0, utils_1.getBTCPriceInDollars)();
        dispatch((0, generalReducer_2.setBTCPrice)(price));
    }), [dispatch]);
    // Use effect hook to run getInstalledWalletName function on component mount
    (0, react_1.useEffect)(() => {
        getInstalledWalletName();
        getBTCPrice();
    }, [dispatch, getBTCPrice, open]);
    // Use effect hook to check if last wallet is in local storage and set selected wallet accordingly
    (0, react_1.useEffect)(() => {
        const localWD = localStorage.getItem("wallet-detail") || "";
        let walletDetail = null;
        if (localWD)
            walletDetail = JSON.parse(localWD);
        const lastWallet = localStorage.getItem("lastWallet");
        if (lastWallet) {
            updateLastWallet(lastWallet);
            // console.log("wallet present");
            // If the last wallet is Leather
            if (lastWallet === "Leather" &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.cardinal) &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.ordinal)) {
                // If the last wallet is leather and user data is present, set the wallet details
                updateLastWallet(lastWallet);
                updateWalletDetails(walletDetail);
            }
            else if ((lastWallet === "Xverse" || lastWallet === "MagicEden") &&
                walletDetail &&
                (!(walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.cardinal) || !(walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.ordinal))) {
                // If the last wallet is xverse and wallet detail is missing, set the wallet details to empty
                updateLastWallet("");
                updateWalletDetails(null);
                localStorage.removeItem("lastWallet");
                localStorage.removeItem("wallet-detail");
                if (lastWallet === "MagicEden") {
                    const wallet = testWallets.filter((a) => a.name === "Magic Eden")[0];
                    setWallet(wallet);
                }
            }
            else if ((lastWallet === "Xverse" || lastWallet === "MagicEden") &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.cardinal) &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.ordinal)) {
                // If the last wallet is xverse and user data is present, set the wallet details
                updateLastWallet(lastWallet);
                updateWalletDetails(walletDetail);
                if (lastWallet === "MagicEden") {
                    const wallet = testWallets.filter((a) => a.name === "Magic Eden")[0];
                    setWallet(wallet);
                }
            }
            else if (lastWallet === "Unisat" &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.cardinal) &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.ordinal)) {
                // If the last wallet is unisat and user data is present, set the wallet details
                updateLastWallet(lastWallet);
                updateWalletDetails(walletDetail);
            }
            else if (lastWallet === "Phantom" &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.cardinal) &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.ordinal)) {
                // If the last wallet is unisat and user data is present, set the wallet details
                updateLastWallet(lastWallet);
                updateWalletDetails(walletDetail);
            }
            else if (lastWallet === "Okx" &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.cardinal) &&
                (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.ordinal)) {
                // If the last wallet is unisat and user data is present, set the wallet details
                updateLastWallet(lastWallet);
                updateWalletDetails(walletDetail);
            }
            else {
                // If the last wallet is not Leather or xverse, set selected wallet to last wallet
                updateLastWallet(lastWallet);
            }
        }
    }, [updateLastWallet, updateWalletDetails]);
    //menu
    const [anchorEl, setAnchorEl] = react_1.default.useState(null);
    const menuOpen = Boolean(anchorEl);
    const handleMenuOpen = (event) => {
        // console.log("opening menu...");
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    //disconnect
    const disconnect = (0, react_1.useCallback)(() => {
        localStorage.removeItem("lastWallet");
        localStorage.removeItem("wallet-detail");
        updateLastWallet("");
        updateWalletDetails(null);
        handleMenuClose();
        // Iterate over all items in localStorage
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith("walletBalance-")) {
                // Remove items that start with 'walletBalance-'
                localStorage.removeItem(key);
            }
        }
    }, [updateLastWallet, updateWalletDetails]);
    (0, react_1.useEffect)(() => {
        if (typeof window.unisat !== "undefined") {
            let unisat = window.unisat;
            // Register the event listeners
            unisat.on("accountsChanged", disconnect);
            unisat.on("networkChanged", disconnect);
        }
        // Cleanup logic for the useEffect hook
        return () => {
            // Remove the event listeners when the component unmounts
            if (typeof window.unisat !== "undefined") {
                let unisat = window.unisat;
                // Register the event listeners
                unisat.on("accountsChanged", disconnect);
                unisat.on("networkChanged", disconnect);
            }
        };
    }, []); // Empty array means this effect runs once on mount and cleanup on unmount
    //xVerse
    const getAddressOptions = {
        payload: {
            purposes: purposes.map((p) => p),
            message: "Address for receiving Ordinals and payments",
            network: (network === null || network === void 0 ? void 0 : network.toLowerCase()) === "testnet" ||
                redux_network.toLowerCase() === "testnet"
                ? {
                    type: "Testnet",
                }
                : {
                    type: "Mainnet",
                },
        },
        onFinish: (response) => __awaiter(this, void 0, void 0, function* () {
            // console.log(response, 'xverse wallet connect')
            // If the last wallet is Leather and user data is present, set the wallet details
            const cardinal = response.addresses.filter((a) => a.purpose === "payment")[0].address;
            const cardinalPubkey = response.addresses.filter((a) => a.purpose === "payment")[0].publicKey;
            const ordinal = response.addresses.filter((a) => a.purpose === "ordinals")[0].address;
            const ordinalPubkey = response.addresses.filter((a) => a.purpose === "ordinals")[0].publicKey;
            const wd = {
                cardinal,
                cardinalPubkey,
                ordinal,
                ordinalPubkey,
                connected: true,
                wallet: "Xverse",
            };
            setTempWD(wd);
            yield signMessage({
                network: (network === null || network === void 0 ? void 0 : network.toLowerCase()) || redux_network.toLowerCase() || "mainnet",
                address: ordinal,
                message: connectionMessage || getMessage(ordinal),
                wallet: "Xverse",
            });
        }),
        onCancel: () => {
            updateLastWallet("");
            localStorage.removeItem("lastWallet");
            localStorage.removeItem("wallet-detail");
            dispatch((0, notificationReducers_1.addNotification)({
                id: new Date().valueOf(),
                message: "User rejected the request",
                open: true,
                severity: "error",
            }));
        },
    };
    const getUnisatAddress = () => __awaiter(this, void 0, void 0, function* () {
        let unisat = window.unisat;
        const accounts = yield unisat.requestAccounts();
        const publicKey = yield unisat.getPublicKey();
        if (accounts.length && publicKey) {
            const wd = {
                wallet: "Unisat",
                ordinal: accounts[0],
                cardinal: accounts[0],
                ordinalPubkey: publicKey,
                cardinalPubkey: publicKey,
                connected: true,
            };
            // console.log("Sign MESSAGE");
            yield signMessage({
                network: (network === null || network === void 0 ? void 0 : network.toLowerCase()) || (redux_network === null || redux_network === void 0 ? void 0 : redux_network.toLowerCase()) || "mainnet",
                address: wd.ordinal,
                message: connectionMessage || getMessage(wd.ordinal),
                wallet: "Unisat",
            });
            setTempWD(wd);
        }
    });
    const getLeatherAddress = () => __awaiter(this, void 0, void 0, function* () {
        // Directly using the btc object from the window, ensure it's correctly typed or casted.
        const btc = window.LeatherProvider;
        // Requesting addresses and awaiting the promise to resolve.
        const response = yield btc.request("getAddresses");
        const userAddresses = response;
        const addresses = userAddresses.result.addresses;
        const ordinalsAddress = addresses.find((x) => x.type === "p2tr");
        const paymentAddress = addresses.find((x) => x.type === "p2wpkh");
        // console.log({ userAddresses });
        if (userAddresses.result.addresses.length) {
            const wd = {
                wallet: "Leather",
                ordinal: ordinalsAddress.address,
                cardinal: paymentAddress.address,
                ordinalPubkey: ordinalsAddress.publicKey,
                cardinalPubkey: paymentAddress.publicKey,
                connected: true,
            };
            yield signMessage({
                network: (network === null || network === void 0 ? void 0 : network.toLowerCase()) || (redux_network === null || redux_network === void 0 ? void 0 : redux_network.toLowerCase()) || "mainnet",
                address: wd.ordinal,
                message: connectionMessage || getMessage(wd.ordinal),
                wallet: "Leather",
            });
            setTempWD(wd);
        }
    });
    const getPhantomAddress = () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Accessing the phantom Bitcoin object from the window
        const phantom = (_b = (_a = window.window) === null || _a === void 0 ? void 0 : _a.phantom) === null || _b === void 0 ? void 0 : _b.bitcoin;
        // Requesting accounts and awaiting the promise to resolve
        const accounts = yield phantom.requestAccounts();
        const userAddresses = accounts;
        const addresses = userAddresses[0];
        if (addresses) {
            const wd = {
                wallet: "Phantom",
                ordinal: addresses ? addresses.address : null,
                cardinal: addresses ? addresses.address : null,
                ordinalPubkey: addresses ? addresses.publicKey : null,
                cardinalPubkey: addresses ? addresses.publicKey : null,
                connected: true,
            };
            // Sign the message with the ordinal address if available
            if (wd.ordinal) {
                yield signMessage({
                    network: (network === null || network === void 0 ? void 0 : network.toLowerCase()) || (redux_network === null || redux_network === void 0 ? void 0 : redux_network.toLowerCase()) || "mainnet",
                    address: wd.ordinal,
                    message: connectionMessage || getMessage(wd.ordinal),
                    wallet: "Phantom",
                });
            }
            else {
                console.warn("No ordinal address found.");
            }
            // Store the wallet data
            setTempWD(wd);
        }
        else {
            console.warn("No addresses found.");
        }
    });
    const getOkxAddress = () => __awaiter(this, void 0, void 0, function* () {
        const Okx = window.okxwallet.bitcoin;
        const accounts = yield Okx.requestAccounts();
        const publicKey = yield Okx.getPublicKey();
        if (accounts.length && publicKey) {
            const wd = {
                wallet: "Okx",
                ordinal: accounts[0],
                cardinal: accounts[0],
                ordinalPubkey: publicKey,
                cardinalPubkey: publicKey,
                connected: true,
            };
            yield signMessage({
                network: (network === null || network === void 0 ? void 0 : network.toLowerCase()) || (redux_network === null || redux_network === void 0 ? void 0 : redux_network.toLowerCase()) || "mainnet",
                address: wd.ordinal,
                message: connectionMessage || getMessage(wd.ordinal),
                wallet: "Okx",
            });
            setTempWD(wd);
        }
    });
    function connectOrDeselect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, sats_connect_1.getAddress)({
                    getProvider: () => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        return (_a = wallet.features[SatsConnectNamespace]) === null || _a === void 0 ? void 0 : _a.provider;
                    }),
                    payload: {
                        purposes: [sats_connect_1.AddressPurpose.Ordinals, sats_connect_1.AddressPurpose.Payment],
                        message: "Address for receiving Ordinals and payments",
                        network: {
                            type: (network === null || network === void 0 ? void 0 : network.toLowerCase()) === "testnet" ||
                                (redux_network === null || redux_network === void 0 ? void 0 : redux_network.toLowerCase()) === "testnet"
                                ? sats_connect_1.BitcoinNetworkType.Testnet
                                : sats_connect_1.BitcoinNetworkType.Mainnet,
                        },
                    },
                    onFinish: (response) => __awaiter(this, void 0, void 0, function* () {
                        connectionStatus === null || connectionStatus === void 0 ? void 0 : connectionStatus.setAccounts(response.addresses);
                        const cardinal = response.addresses.filter((a) => a.purpose === "payment")[0].address;
                        const cardinalPubkey = response.addresses.filter((a) => a.purpose === "payment")[0].publicKey;
                        const ordinal = response.addresses.filter((a) => a.purpose === "ordinals")[0].address;
                        const ordinalPubkey = response.addresses.filter((a) => a.purpose === "ordinals")[0].publicKey;
                        const wd = {
                            cardinal,
                            cardinalPubkey,
                            ordinal,
                            ordinalPubkey,
                            connected: true,
                            wallet: "MagicEden",
                        };
                        yield signMessage({
                            network: (network === null || network === void 0 ? void 0 : network.toLowerCase()) ||
                                redux_network.toLowerCase() ||
                                "mainnet",
                            address: cardinal,
                            message: connectionMessage || getMessage(cardinal),
                            wallet: "MagicEden",
                        });
                        setTempWD(wd);
                    }),
                    onCancel: () => {
                        alert("Request canceled");
                    },
                });
            }
            catch (err) {
                console.log({ err }, "MEWALLETERROR");
                setWallet(null);
            }
        });
    }
    (0, react_1.useEffect)(() => {
        // console.log({ tempWD, result });
        if (tempWD && result) {
            localStorage.setItem("wallet-detail", JSON.stringify(tempWD));
            updateWalletDetails(tempWD);
            updateLastWallet(tempWD.wallet);
            localStorage.setItem("lastWallet", tempWD.wallet);
            handleClose();
        }
    }, [tempWD, result]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", null,
            react_1.default.createElement(WalletButton_1.default, { wallets: wallets, lastWallet: lastWallet, walletDetails: walletDetails, handleMenuOpen: handleMenuOpen, handleMenuClose: handleMenuClose, handleOpen: handleOpen, handleClose: handleClose, anchorEl: anchorEl, disconnect: disconnect, menuOpen: menuOpen, classname: buttonClassname, InnerMenu: InnerMenu, balance: balance }),
            react_1.default.createElement(WalletModal_1.default, { open: open, handleClose: handleClose, wallets: wallets, getLeatherAddress: getLeatherAddress, getPhantomAddress: getPhantomAddress, getOkxAddress: getOkxAddress, getAddress: sats_connect_1.getAddress, getAddressOptions: getAddressOptions, getUnisatAddress: getUnisatAddress, modalContainerClass: modalContainerClass, modalContentClass: modalContentClass, closeButtonClass: closeButtonClass, headingClass: headingClass, walletItemClass: walletItemClass, walletImageClass: walletImageClass, walletLabelClass: walletLabelClass, icon: icon, iconClass: iconClass, meWallets: testWallets, setWallet: setWallet }))));
}
exports.default = ConnectMultiWallet;
