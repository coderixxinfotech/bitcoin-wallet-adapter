// Function to convert price from satoshi to Bitcoin
export function convertSatToBtc(priceInSat: number): number {
  return priceInSat / 1e8; // 1 BTC = 100,000,000 SAT
}

// Function to convert price from satoshi to Bitcoin
export function convertBtcToSat(priceInSat: number): number {
  return priceInSat * 1e8; // 1 BTC = 100,000,000 SAT
}

export function base64ToHex(str: string) {
  return atob(str)
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

export async function getBTCPriceInDollars() {
  try {
    const response = await fetch(
      "https://api.coindesk.com/v1/bpi/currentprice/BTC.json"
    );
    const data = await response.json();
    const priceInDollars = data.bpi.USD.rate_float;
    return priceInDollars;
  } catch (error) {
    console.error("Error fetching BTC price:", error);
    return null;
  }
}

export function shortenString(str: string, length = 4): string {
  if (str.length <= 8) {
    return str;
  }
  const start = str.slice(0, length);
  const end = str.slice(-length);
  return `${start}...${end}`;
}

export const hexToBase64 = (hexString: string) => {
  const bytes = new Uint8Array(Math.ceil(hexString.length / 2));

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }

  const byteArray = Array.from(bytes);

  return btoa(String.fromCharCode.apply(null, byteArray));
};

export const isHex = (str: string) => /^[0-9a-fA-F]+$/.test(str);

export const isBase64 = (str: string) => {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};
