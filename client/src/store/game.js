// import api from './api'

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
    rotateShip ({commit}) {
      commit('rotateShip')
    },
    setPlayerShips ({commit}, playerShipList) {
      commit('setPlayerShips', playerShipList)
    },
    startGame ({commit}) {
      commit('clearBlockedCells')
    }
  },
  getters: {
    playerShipList: state => state.playerShipList,
    playerField: state => state.playerField,
    horisontalDirection: state => state.horisontalDirection,
    cellType: state => state.cellType
  }
}
