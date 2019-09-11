import api from './api'

export default {
  state: {
    user: {
      name: '???',
      id: '',
      winrate: '50%'
    },
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    setUser (state, user) {
      state.user.id = user.id
      state.user.name = user.name
      state.user.winrate = user.winrate + '%'
    },
    setToken (state, token) {
      state.token = token
      localStorage.setItem('token', token)
    }
  },
  actions: {
    async login ({commit}) {
      try {
        const response = await api().get('user/login')
        const user = {
          name: response.data.name,
          id: response.data.id,
          winrate: response.data.winrate
        }
        commit('setUser', user)
      } catch (err) {
        commit('setMessage', err)
      }
    },
    signup ({commit}, data) {
      return api().post('user/signup', data)
        .then(response => {
          console.log(response)
          const user = {
            name: response.data.name,
            id: response.data.id,
            winrate: response.data.winrate
          }
          commit('setUser', user)
          commit('setToken', response.data.token)
        })
        .catch(err => {
          commit('setMessage', err)
          localStorage.removeItem('token')
        })
    },
    logout ({commit}) {
      api().post('user/logout')
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    userName: state => state.user.name
  }
}
