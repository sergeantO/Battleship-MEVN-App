import api from './api'

export default {
  state: {
    playerShipList: [],
    playerField: [],
    horisontalDirection: true,
    cellType: {
      EMPTY: 'empty',
      BLOCKED: 'blocked',
      CLOSED: 'closed',
      SELECTED: 'selected'
    }
  },
  mutations: {
    setPlayerShips (state, playerShipList) {
      state.playerShipList = playerShipList
    },
    initPlayerField (state, playerField) {
      state.playerField = playerField.map(point => {
        return {
          x: point.x,
          y: point.y,
          type: state.cellType.EMPTY
        }
      })
    },
    rotateShip (state) {
      state.horisontalDirection = !state.horisontalDirection
    },
    clearBlockedCells (state) {
      state.playerField.forEach(element => {
        if (element.type === state.cellType.BLOCKED) {
          element.type = state.cellType.EMPTY
        }
      })
    },
    reset (state) {
      state.playerField.forEach(element => {
        element.type = state.cellType.EMPTY
      })
    },
    shotOnPlayerField (state, point) {

    }
  },
  actions: {
    initPlayerField ({commit}) {
      let tempArr = []
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          tempArr.push({x, y})
        }
      }
      commit('initPlayerField', tempArr)
    },
    reset ({commit}) {
      commit('reset')
    },
    rotateShip ({commit}) {
      commit('rotateShip')
    },
    setPlayerShips ({commit}, playerShipList) {
      commit('setPlayerShips', playerShipList)
    },
    async startGame ({commit, state, rootState}) {
      try {
        const response = await api().post('game/find/' + rootState.user.user.id, state.playerShipList)
        // const data = response.data
        if (response.status !== 200) {
          return Promise.reject(new Error(response.status))
        }
        commit('clearBlockedCells')
      } catch (err) {
        console.log(err)
        return Promise.reject(err)
      }
    }
  },
  getters: {
    playerShipList: state => state.playerShipList,
    playerField: state => state.playerField,
    horisontalDirection: state => state.horisontalDirection,
    cellType: state => state.cellType
  }
}
