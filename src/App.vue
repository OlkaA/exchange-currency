<template>
  <div
    id="app"
    class="app-wrapper flex column justify-space-around align-center"
  >
    <h2>Currency Converter</h2>
    <ExchangeComponent />
    <p class="text">
      It is very easy to use the Currency Converter. Just choose currencies in
      two blocks, then choose needed amount (in any block) and get exchanged
      value in another block 😉.
    </p>
  </div>
</template>

<script>
import ExchangeComponent from "./components/ExchangeComponent.vue";

export default {
  name: "App",
  components: {
    ExchangeComponent,
  },
};
</script>

<style lang="scss">
html {
  height: 100vh;
  font-size: 16px;
  font-family: "system-ui", sans-serif;
}

body {
  height: 100vh;
  margin: 0;
  padding: 0;
}
.app-wrapper {
  width: 1024px;
  min-height: 100vh;
  margin: 0 auto;
}

.flex {
  display: flex;

  &.column {
    flex-direction: column;
  }

  &.row {
    flex-direction: row;
  }

  &.justify-center {
    justify-content: center;
  }

  &.justify-space-between {
    justify-content: space-between;
  }

  &.justify-space-around {
    justify-content: space-around;
  }

  &.align-center {
    align-items: center;
  }
}

h2 {
  font-size: 4rem;
  font-style: italic;
  text-align: center;
}

p.text {
  max-width: 500px;
  text-align: center;
  margin: 50px 0;
  font-size: 1.4rem;
}

.no-scroll {
  overflow-y: hidden;
}

@media only screen and (max-width: 1024px) {
  .app-wrapper {
    width: 90vw;
  }
}

@media only screen and (max-width: 800px) {
  .flex.row {
    flex-direction: column;
  }
}
</style>
