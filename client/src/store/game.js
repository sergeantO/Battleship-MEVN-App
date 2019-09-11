import api from './api'

export default {
  state: {
    playerShipList: [],
    horisontalDirection: true,
    cellType: {
      SELECTED: 'selected',
      EMPTY: 'empty',
      BLOCKED: 'blocked',
      CLOSED: 'closed',
      MISSED: 'missed'
    },

    playerField: [],
    enemyField: [],
    woundedShip: [],
    gameID: localStorage.getItem('gameID') || '',
    turn: false,
    message: '',
    enemyName: 'Противник'
  },
  mutations: {
    initPlayerField: (state) => {
      let tempArr = []
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          tempArr.push({
            x: x,
            y: y,
            type: state.cellType.EMPTY
          })
        }
      }
      state.playerField = tempArr
    },
    initEnemyField: (state) => {
      let tempArr = []
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          tempArr.push({
            x: x,
            y: y,
            type: state.cellType.EMPTY
          })
        }
      }
      state.enemyField = tempArr
    },
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
    setGameID: (state, gameID) => {
      state.gameID = gameID
      localStorage.setItem('gameID', gameID)
    },
    setTurn: (state, turn) => {
      state.turn = turn
      if (turn) {
        state.message = 'Ваш ход'
      } else {
        state.message = 'Ход противника'
      }
    },
    shotOnPlayerField (state, points) {
      points.forEach(point => {
        const pnt = state.playerField.filter(cell => {
          return cell.y === point.y && cell.x === point.x
        })[0]

        switch (point.status) {
          case 'miss':
            pnt.type = state.cellType.MISSED
            break
          case 'killed':
          case 'wounded':
            pnt.type = state.cellType.BLOCKED
            break
          case 'win':
            state.gameID = ''
            localStorage.removeItem('gameID')
            break
        }
      })
    },
    shotOnEnemyField (state, point) {
      console.log(point)
      const pnt = state.enemyField.filter(cell => {
        return cell.y === point.y && cell.x === point.x
      })[0]

      switch (point.status) {
        case 'miss':
          pnt.type = state.cellType.MISSED
          break
        case 'killed':
          state.woundedShip.push(pnt)
          state.woundedShip.forEach(segment => {
            segment.type = state.cellType.CLOSED
          })
          state.woundedShip = []
          break
        case 'wounded':
          pnt.type = state.cellType.BLOCKED
          state.woundedShip.push(pnt)
          break
      }
    },
    setMessage: (state, message) => { state.message = message }
  },
  actions: {
    initFields ({commit, state}) {
      commit('initPlayerField')
      commit('initEnemyField')
    },
    reset: ({commit}) => { commit('reset') },
    rotateShip: ({commit}) => { commit('rotateShip') },
    setPlayerShips: ({commit}, playerShipList) => { commit('setPlayerShips', playerShipList) },
    setMessage: ({commit}, message) => { commit('setMessage', message) },
    async startGame ({commit, state, rootState}) {
      try {
        const response = await api().post('game/find/', state.playerShipList)
        console.log(response.data)
        commit('clearBlockedCells')
        commit('setGameID', response.data.gameID)
        commit('setTurn', response.data.turn)
      } catch (err) {
        console.log(err)
        return Promise.reject(err)
      }
    },
    async reconnect ({commit, state}) {
      if (state.gameID !== '') {
        commit('setMessage', 'Переподключаемся')
        const response = await api().get(`game/reconnect/${state.gameID}`)
        console.log(response.data)
        commit('initPlayerField')
        commit('initEnemyField')
      }
    },
    async shot ({commit, state}, point) {
      if (state.turn) {
        const response = await api().post(`game/shot/${state.gameID}`, point)
        console.log(response.data)
        commit('shotOnEnemyField', response.data.point)
        commit('setTurn', response.data.turn)
      }
    },
    async wait ({commit, state}) {
      const response = await api().get(`game/wait/${state.gameID}`)
      console.log(response.data)
      commit('setTurn', response.data.turn)
      commit('shotOnPlayerField', response.data.playerShots)
    }
  },
  getters: {
    playerShipList: state => state.playerShipList,
    horisontalDirection: state => state.horisontalDirection,
    cellType: state => state.cellType,

    playerField: state => state.playerField,
    enemyField: state => state.enemyField,

    message: state => state.message,
    yourTurn: state => state.turn,
    enemyName: state => state.enemyName
  }
}
