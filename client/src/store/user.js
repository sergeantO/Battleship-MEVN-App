import api from './api'

export default {
  state: {
    status: '',
    user: {
      name: localStorage.getItem('name') || '',
      id: localStorage.getItem('id') || ''
    },
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, data) {
      state.status = 'success'
      state.token = data.token
      state.user.id = data.id
      state.user.name = data.name
      localStorage.setItem('token', data.token)
      localStorage.setItem('name', data.name)
      localStorage.setItem('id', data.id)
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
        const user = {
          name: response.data.user.name,
          id: response.data.user._id,
          token: response.data.token
        }
        console.log(user)
        commit('auth_success', user)
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
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    idd: state => state.user.id
  }
}
