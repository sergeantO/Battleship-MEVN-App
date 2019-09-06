<template lang="pug">
  .contai
    input(v-model="name" placeholder="Введите свое имя")
    input(
      type="button"
      value="SignIn"
      @click="login"
    )
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
        .then(() => this.$router.push('/'))
        .catch(err => console.log(err))
    }
  }
}
</script>
