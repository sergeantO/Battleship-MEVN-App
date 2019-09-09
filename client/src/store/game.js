import api from './api'

export default {
  state: {
    playerShipList: [],
    horisontalDirection: true,
    cellType: {
      EMPTY: 'empty',
      BLOCKED: 'blocked',
      CLOSED: 'closed',
      SELECTED: 'selected',
      MISSED: 'missed'
    },

    playerField: [],
    enemyField: [],
    woundedShip: [],
    gameID: '',
    turn: true
  },
  mutations: {
    initPlayerField: (state, tempArr) => { state.playerField = tempArr },
    initEnemyField: (state, tempArr) => { state.enemyField = tempArr },
    setPlayerShips: (state, playerShipList) => { state.playerShipList = playerShipList },
    rotateShip: (state) => { state.horisontalDirection = !state.horisontalDirection },
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
    setGameID: (state, gameID) => { state.gameID = gameID },
    setTurn: (state, turn) => {
      if (state.turn) {
        state.turn = turn
      }
    },
    shotOnPlayerField (state, point) {

    },
    shotOnEnemyField (state, data) {
      const point = state.enemyField.filter(cell => {
        return cell.y === data.point.y && cell.x === data.point.x
      })[0]

      switch (data.resault) {
        case 'miss':
          point.type = state.cellType.MISSED
          break;
        case 'killed':
          state.woundedShip.push(point)
          state.woundedShip.forEach(segment => {
            segment.type = state.cellType.CLOSED
          })
          state.woundedShip = []
          break;
        case 'wounded':
          point.type = state.cellType.BLOCKED
          state.woundedShip.push(point)
          break;
        case 'win':
          
          break;
      }
    }
  },
  actions: {
    initFields ({commit, state}) {
      let tempArr1 = []
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          tempArr1.push({
            x: x,
            y: y,
            type: state.cellType.EMPTY
          })
        }
      }
      commit('initPlayerField', tempArr1)

      let tempArr2 = []
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          tempArr2.push({
            x: x,
            y: y,
            type: state.cellType.EMPTY
          })
        }
      }
      commit('initEnemyField', tempArr2)
    },
    reset: ({commit}) => { commit('reset') },
    rotateShip: ({commit}) => { commit('rotateShip') },
    setPlayerShips: ({commit}, playerShipList) => { commit('setPlayerShips', playerShipList) },
    async startGame ({commit, state, rootState}) {
      try {
        const response = await api().post('game/find/' + rootState.user.user.id, state.playerShipList)
        if (response.status !== 201) {
          return Promise.reject(new Error(response.status))
        }
        console.log(response.data)
        commit('clearBlockedCells')
        commit('setGameID', response.data.gameID)
        commit('setTurn', response.data.turn)
      } catch (err) {
        console.log(err)
        return Promise.reject(err)
      }
    },
    async shot ({commit, state}, point) {
      const str = `game/shot/${state.gameID}`
      console.log(str)
      const response = await api().post(str, point)
      if (response.status !== 200) {
        return Promise.reject(new Error(response.status))
      }
      console.log(response.data)
      commit('shotOnEnemyField', {point, resault: response.data})
    }
  },
  getters: {
    playerShipList: state => state.playerShipList,
    horisontalDirection: state => state.horisontalDirection,
    cellType: state => state.cellType,

    playerField: state => state.playerField,
    enemyField: state => state.enemyField
  }
}
