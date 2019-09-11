<template>
  <div id="app">
    <h1>Морской бой</h1>
    <h2>{{ msg }}</h2>
    <router-view/>
    <div class="app">
      <p>{{ app }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    app () {
      return this.$store.getters.app
    },
    msg () {
      return this.$store.getters.message
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

.app {
  position: absolute;
  bottom: 0.5em;
  right: 0.5em;
  font-size: 0.7em;
}

</style>
