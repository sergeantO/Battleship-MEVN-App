<template lang="pug">
  div
    .row
      button.button(
        v-for="(ship, index) in unplacedShips"
        @click="selectedShipType=index"
        :disabled="ship.left === 0") {{ ship.name }} (осталось {{ship.left}})

    .row
      button.button(@click="rotateShip(0,0)") повернуть

    .row
      .battleground
        .cell(
          v-for="(cell, index) in battleground"
          :key="cell.x + cell.y * 10"
          @mouseover="selectCells(cell.x, cell.y)"
          @click="placeShip(cell.x, cell.y)"
          @wheel.prevent="rotateShip(cell.x, cell.y)"
          :class="cell.type"
        )

    .row
      transition(name="fade")
        button.button(
          v-if="canStart"
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
@import '../../assets/mixins';
@import '../../assets/animations';

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-basis: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 10px 0;
}

.button {
  @include buttonReset;
  padding: 0.5em 1.2em;
  border: 1px solid #aaa;
  border-radius: 3px;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  margin: 2px;
}

.battleground {
  width: 502px;
  height: 502px;
  border: 1px solid #aaa;
  border-radius: 7px;
  display: flex;
  flex-flow: row wrap;

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
}

</style>
