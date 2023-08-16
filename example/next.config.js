const path = require("path");

module.exports = {
  webpack: (config) => {
    config.resolve.alias["bitcoin-wallet-adapter"] = path.resolve(
      __dirname,
      "../dist"
    );
    return config;
  },
};
