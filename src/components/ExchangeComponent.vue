<template>
  <div class="flex row justify-space-between align-center">
    <div class="currency-block flex column justify-space-around">
      <div>Currency I have</div>
      <select v-model="firstCurrency.name" class="select">
        <optgroup
          v-for="group in currencies"
          :key="group.currencyType"
          :label="group.currencyType"
        >
          <option v-for="(currency, index) in group.array" :key="index">{{
            currency
          }}</option>
        </optgroup>
      </select>
      <div>Amount</div>
      <input
        type="number"
        :value="firstCurrency.amount"
        @change="formCurrenciesAmount(1, $event)"
        @keyup="formCurrenciesAmount(1, $event)"
        min="0"
      />
    </div>

    <img
      alt="Exchange logo"
      class="exchange-logo"
      src="../assets/exchange-currency-icon.png"
    />

    <div class="currency-block flex column justify-space-around">
      <div>Currency I want</div>
      <select v-model="secondCurrency.name" class="select">
        <optgroup
          v-for="group in currencies"
          :key="group.currencyType"
          :label="group.currencyType"
        >
          <option v-for="(currency, index) in group.array" :key="index">{{
            currency
          }}</option>
        </optgroup>
      </select>
      <div>Amount</div>
      <input
        type="number"
        :value="secondCurrency.amount"
        @change="formCurrenciesAmount(2, $event)"
        @keyup="formCurrenciesAmount(2, $event)"
        min="0"
      />
    </div>
    <ToastComponent
      v-if="errorMessageExist"
      msg="This exchange rate does not exist. Try another currencies pair."
    />
  </div>
</template>

<script>
import * as API from "../fetchAPI";
import { CurrencyType } from "../enum";
import ToastComponent from "./ToastComponent.vue";

export default {
  name: "ExchangeComponent",

  components: {
    ToastComponent,
  },

  data() {
    return {
      currencies: [],
      initialAmount: 10,
      firstCurrency: {
        name: "USD",
        amount: null,
        type: null,
      },
      secondCurrency: {
        name: "DKK",
        amount: null,
        type: null,
      },
      errorMessageExist: false,
    };
  },

  watch: {
    "firstCurrency.name": async function(name) {
      this.firstCurrency.type = this.getCurrencyType(name);
      this.formCurrenciesAmount(1);
    },
    "secondCurrency.name": async function(name) {
      this.secondCurrency.type = this.getCurrencyType(name);
      this.formCurrenciesAmount(2);
    },
  },

  async mounted() {
    const fiatResponse = await API.getFiatCurrencies();
    const binanceResponse = await API.getBinanceCurrencies();

    this.currencies = [
      {
        currencyLabel: "Fiat currencies",
        currencyType: CurrencyType.FIAT,
        array: Object.keys(fiatResponse.rates),
      },
      {
        currencyLabel: "Binance currencies",
        currencyType: CurrencyType.BINANCE,
        array: [
          ...new Set(binanceResponse.symbols.map((symbol) => symbol.baseAsset)),
        ],
      },
    ];

    this.firstCurrency.type = this.getCurrencyType(this.firstCurrency.name);
    this.secondCurrency.type = this.getCurrencyType(this.secondCurrency.name);
    this.firstCurrency.amount = this.initialAmount;
    await this.formCurrenciesAmount(1);
  },

  methods: {
    formCurrenciesAmount: async function(blockId, event) {
      const amount = event?.target.value ? +event.target.value : 10;

      if (blockId === 1) {
        this.firstCurrency.amount = amount;
        this.secondCurrency.amount =
          (await this.getRate(this.firstCurrency, this.secondCurrency)) *
          amount;
      } else if (blockId === 2) {
        this.secondCurrency.amount = amount;
        this.firstCurrency.amount =
          (await this.getRate(this.secondCurrency, this.firstCurrency)) *
          amount;
      }
    },

    getFiatRate: async function(firstName, secondName) {
      const response = await API.getSpecificExchangeRates(
        firstName,
        secondName
      );

      if (typeof response === "string") {
        this.showToast();
        return;
      }

      return Object.values(response.rates)[0];
    },

    getBinanceRate: async function(firstName, secondName) {
      const response = await API.getSpecificBinanceExchangeRates(
        firstName + secondName
      );

      if (typeof response === "string") {
        const toggledParamsResponse = await API.getSpecificBinanceExchangeRates(
          secondName + firstName
        );

        if (typeof toggledParamsResponse === "string") {
          this.showToast();
          return;
        } else {
          return 1 / toggledParamsResponse.price;
        }
      }
      return response.price;
    },

    getRate: async function(firstCurrency, secondCurrency) {
      if (
        firstCurrency.type === CurrencyType.FIAT &&
        secondCurrency.type === CurrencyType.FIAT
      ) {
        return await this.getFiatRate(firstCurrency.name, secondCurrency.name);
      } else if (
        firstCurrency.type === CurrencyType.BINANCE &&
        secondCurrency.type === CurrencyType.BINANCE
      ) {
        return await this.getBinanceRate(
          firstCurrency.name,
          secondCurrency.name
        );
      } else {
        if (firstCurrency.type === CurrencyType.FIAT) {
          const binance = await this.getBinanceRate(
            secondCurrency.name,
            "USDT"
          );
          const fiat =
            firstCurrency.name === "USD"
              ? 1
              : await this.getFiatRate(firstCurrency.name, "USD");
          return fiat / +binance;
        } else {
          const binance = await this.getBinanceRate(firstCurrency.name, "USDT");
          const fiat =
            firstCurrency.name === "USD"
              ? 1
              : await this.getFiatRate(secondCurrency.name, "USD");
          return +binance / fiat;
        }
      }
    },

    getCurrencyType: function(name) {
      const result = this.currencies.find((item) => item.array.includes(name));
      return result && result.currencyType;
    },

    showToast: function() {
      this.errorMessageExist = true;
      setTimeout(() => (this.errorMessageExist = false), 3000);
    },
  },
};
</script>

<style scoped lang="scss">
img.exchange-logo {
  width: 100px;
  height: auto;
  margin: 20px;
}

.currency-block {
  padding: 4rem;
  border: 2px solid darkgrey;
  border-radius: 23px;
  box-shadow: 2px 2px 7px 0px darkgrey;
  height: 150px;
  font-size: 1.5rem;
}

.select,
input[type="number"] {
  display: block;
  font-size: 1rem;
  font-family: sans-serif;
  font-weight: 700;
  color: #444;
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  border-radius: 0.5em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
    linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;

  &:hover {
    border-color: #888;
  }

  &:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
  }
}

input[type="number"] {
  background-image: none;
  height: 40px;
}

@media only screen and (max-width: 1024px) {
  .currency-block {
    padding: 2rem;
  }
}

@media only screen and (max-width: 800px) {
  .flex.row {
    flex-direction: column;
  }
  .currency-block {
    padding: 2rem 4rem;
  }
}
</style>
