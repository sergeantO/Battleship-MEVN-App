import api from './api'

export default {
  state: {
    status: '',
    user: null,
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, token, user) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
    }
  },
  actions: {
    async login ({commit}, data) {
      try {
        commit('auth_request')
        const response = await api().post('user/signup', data)
        const user = response.data.user
        const token = response.data.token
        localStorage.setItem('token', token)
        api().defaults.headers.common['Authorization'] = token
        commit('auth_success', token, user)
      } catch (error) {
        console.log(error)
        commit('auth_error')
        localStorage.removeItem('token')
      }
    },
    logout ({commit}) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        delete api().defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  }
}
