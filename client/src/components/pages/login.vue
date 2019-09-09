<template lang="pug">
.container
  .row
    input(v-model="name" placeholder="Введите свое имя")
  .row
    button.button(
      @click="login"
    ) SignIn
</template>

<script>
export default {
  data () {
    return {
      name
    }
  },
  methods: {
    login () {
      let data = {
        name: this.name
      }
      this.$store.dispatch('login', data)
        .then(() => this.$router.replace('/'))
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/common';

.container {
  margin: 5rem;
}
input {
  border: none;
  border-bottom: 1px solid #ccc;
  width: 80%;
  text-align: center;
  line-height: 2.5;
  font-size: 16px;
  &:focus {
    outline:none;
  }
}
</style>
