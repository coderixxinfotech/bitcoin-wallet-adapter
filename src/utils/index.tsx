// Function to convert price from satoshi to Bitcoin
export function convertSatToBtc(priceInSat: number): number {
  return priceInSat / 1e8; // 1 BTC = 100,000,000 SAT
}

// Function to convert price from satoshi to Bitcoin
export function convertBtcToSat(priceInSat: number): number {
  return priceInSat * 1e8; // 1 BTC = 100,000,000 SAT
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

export function shortenString(str: string): string {
  if (str.length <= 8) {
    return str;
  }
  const start = str.slice(0, 4);
  const end = str.slice(-4);
  return `${start}...${end}`;
}