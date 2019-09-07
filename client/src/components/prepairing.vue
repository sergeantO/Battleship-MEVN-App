<template lang="pug">
  div
    .ships
      button.ships-button(
        v-for="(ship, index) in unplacedShips"
        @click="selectedShipType=index"
        :disabled="ship.left === 0") {{ ship.name }} (осталось {{ship.left}})

    .flip
      button.flip-button(@click="rotateShip(1,1)") повернуть

    #battleground
      .cell(
        v-for="cell in battleground"
        @mouseover="selectCells(cell.x, cell.y)"
        @click="placeShip(cell.x, cell.y)"
        @wheel.prevent="rotateShip(cell.x, cell.y)"
        :class="cell.type"
      )

    .start-game
      button(
        :disabled="!canStart"
        @click="startGame"
      ) начать игру
</template>

<script>
export default {
  name: 'prepairing',
  data () {
    return {
      canStart: false,
      playerShips: [],

      selectedCells: [],

      selectedShipType: 0,
      unplacedShips: [
        { name: 'Линкор', size: 4, left: 1 },
        { name: 'Крейсер', size: 3, left: 2 },
        { name: 'Эсминец', size: 2, left: 3 },
        { name: 'Катер', size: 1, left: 4 }
      ]
    }
  },

  methods: {
    rotateShip (x, y) {
      this.$store.dispatch('rotateShip')
      this.selectCells(x, y)
    },

    selectCells (x, y) {
      // reset battleground
      if (this.selectedCells.every(cell => cell.type === this.cellType.SELECTED)) {
        this.selectedCells.forEach(element => {
          element.type = this.cellType.EMPTY
        })
      }

      // filling selectedCells
      if (this.selectedShipType !== null) {
        this.selectedCells = this.battleground.filter(cell => {
          if (this.horisontalDirection) {
            return cell.y === y &&
                cell.x - x < this.currentTypeShip.size &&
                cell.x - x >= 0 &&
                x + this.currentTypeShip.size < 11
          } else {
            return cell.x === x &&
                cell.y - y < this.currentTypeShip.size &&
                cell.y - y >= 0 &&
                y + this.currentTypeShip.size < 11
          }
        })
        // draw ship
        if (this.selectedCells.every(cell => cell.type === this.cellType.EMPTY)) {
          this.selectedCells.forEach(element => {
            element.type = this.cellType.SELECTED
          })
        } else {
          this.selectedCells = []
        }
      }
    },

    placeShip (x, y) {
      if (this.selectedCells.length > 0) {
        // Add new ship in ships
        let newShip = []
        this.selectedCells.forEach(s => {
          const point = {x: s.x, y: s.y}
          newShip.push(point)
        })
        this.playerShips.push({status: 'intact', ship: newShip}) // intact, wounded, killed

        // bloced cells on battleground
        this.battleground.filter(cell => {
          if (this.horisontalDirection) {
            return Math.abs(cell.y - y) < 2 &&
                Math.abs(cell.x - x) < this.currentTypeShip.size + 1 &&
                cell.x - x > -2
          } else {
            return Math.abs(cell.x - x) < 2 &&
                Math.abs(cell.y - y) < this.currentTypeShip.size + 1 &&
                cell.y - y > -2
          }
        }).forEach(element => {
          element.type = 'blocked'
        })

        // draw ship on battleground
        this.selectedCells.forEach(element => {
          element.type = 'closed'
        })

        // count unplacedShips
        this.currentTypeShip.left -= 1
        if (this.currentTypeShip.left === 0) {
          if (this.unplacedShips.every(element => {
            return element.left === 0
          })) {
            this.canStart = true
            this.$store.dispatch('setPlayerShips', this.playerShips)
          }
          this.selectedShipType = null
        }
      }
    },

    startGame () {
      this.$store.dispatch('startGame')
    }
  },

  computed: {
    ships () {
      return this.$store.getters.ships
    },
    currentTypeShip () {
      return this.unplacedShips[this.selectedShipType]
    },
    battleground () {
      return this.$store.getters.playerField
    },
    horisontalDirection () {
      return this.$store.getters.horisontalDirection
    },
    cellType () {
      return this.$store.getters.cellType
    }
  },

  mounted () {
    // INIT BUTTLEGROUND
    this.$store.dispatch('initPlayerField')
  }
}
</script>

<style lang="scss" scoped>
@mixin centererX {
  position: absolute;
  left: 50%;
  margin-right: -50%;
  transform: translateX(-50%);
}

@mixin centerer {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%)
}

@mixin buttonReset {
   padding: 0;
   border: none;
   font: inherit;
   color: inherit;
   background-color: transparent;
   cursor: pointer;
}

.ships {
  @include centererX;
  margin-top: 10px;

  &-button {
    @include buttonReset;
    margin: 5px;
    padding: 5px 10px;
    border: 1px solid #aaa;
    border-radius: 3px;
  }
}

.flip {
  @include centererX;
  margin-top: 50px;

  &-button {
    @include buttonReset;
    margin: 10px auto;
    padding: 10px 30px;
    border: 1px solid #aaa;
    border-radius: 3px;
  }
}

.start-game{
  @include centererX;
  bottom: 90px;

  button {
    padding: 10px 30px;
  }
}

#battleground {
  @include centerer;

  width: 502px;
  height: 502px;
  border: 1px solid #aaa;
  border-radius: 7px;
  // FlEX
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-content: center;
}

.cell{
  max-width: 50px;
  height: 50px;
  border: 1px dotted rgba(#ccc, 0.5);
  flex: 0 0 20%;
  align-self: center;

  &.empty{ background-color: #fff; }
  &.selected { background-color: green; }
  &.closed { background-color: red; }
  &.blocked { background-color: pink; }
}
</style>
