<template>
  <div class="toast-wrapper flex column justify-center align-center">
    <div class="toast-message">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: "CurrencyBlockComponent",
  props: {
    msg: String,
  },

  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.toast-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);

  .toast-message {
    width: 30vw;
    background-color: white;
    text-align: center;
    padding: 20px;
    border-radius: 5px 5px 0 0;
    font-size: 1.5rem;
    position: relative;
    animation: seconds 2.99s forwards;

    &:after {
      content: "";
      width: 100%;
      height: 5px;
      position: absolute;
      bottom: 0;
      right: 0;
      border-radius: 0% 0% 5px 5px;
      background-color: rebeccapurple;
      animation: line 2.95s forwards;
    }
  }
}

@media only screen and (max-width: 1024px) {
  .toast-wrapper .toast-message {
    width: 60%;
  }
}

@media only screen and (max-width: 800px) {
  .toast-wrapper .toast-message {
    width: 80%;
  }
}

@keyframes seconds {
  0% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes line {
  0% {
    width: 100%;
  }
  100% {
    width: 0;
  }
}
</style>
