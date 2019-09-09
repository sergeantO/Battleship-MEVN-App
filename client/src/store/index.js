import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import game from './game'

import {name, version} from '../../../package.json'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    game
  },
  state: {
    App: `${name} ${version}`
  },
  getters: {
    app: (state) => {
      return state.App
    }
  }
})
