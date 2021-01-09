const getFiatCurrencies = async function() {
  const response = await fetch(`https://api.exchangeratesapi.io/latest`);
  return await response.json();
};

const getBinanceCurrencies = async function() {
  const response = await fetch(`https://api.binance.com/api/v3/exchangeInfo`);
  return await response.json();
};

const getSpecificExchangeRates = async function(base, symbols) {
  try {
    const response = await fetch(
      `https://api.exchangeratesapi.io/latest?base=${base}&symbols=${symbols}`
    );
    return await response.json();
  } catch (err) {
    return "type error";
  }
};

const getSpecificBinanceExchangeRates = async function(symbol) {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );
    return await response.json();
  } catch (err) {
    return "type error";
  }
};

export {
  getFiatCurrencies,
  getSpecificExchangeRates,
  getBinanceCurrencies,
  getSpecificBinanceExchangeRates,
};
