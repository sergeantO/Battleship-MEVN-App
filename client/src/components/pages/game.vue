<template lang="pug">
  div
    .row
      .wrap
        p {{ enemyName }}
        .battleground
          .cell(
            v-for="(cell, index) in enemyField"
            @mouseover="selectCell(cell.x, cell.y)"
            @click="shot()"
            :class="cell.type"
          )
      .wrap
        p {{ userName }}
        .battleground
          .cell(
            v-for="(cell, index) in playerField"
            :class="cell.type"
          )
    .row
      button.button(@click="reconect()") Переподключиться
</template>

<script>
export default {
  name: 'prepairing',
  data () {
    return {
      selectedCell: {}
    }
  },

  methods: {
    selectCell (x, y) {
      // reset battleground
      if (this.selectedCell.type === this.cellType.SELECTED) {
        this.selectedCell.type = this.cellType.EMPTY
      }

      this.selectedCell = this.enemyField.filter(cell => {
        return cell.y === y && cell.x === x
      })[0]

      if (this.selectedCell.type === this.cellType.EMPTY) {
        this.selectedCell.type = this.cellType.SELECTED
      } else {
        this.selectedCell = {}
      }
    },
    shot () {
      if (this.yourTurn) {
        const point = this.selectedCell
        if (point !== {} && point.type === this.cellType.SELECTED) {
          this.$store.dispatch('shot', { x: point.x, y: point.y })
            .then(() => {
              if (!this.yourTurn) {
                this.wait()
              }
            })
            .catch(err => { console.log(err) })
        }
      }
    },
    reconect () {
      this.$store.dispatch('reconnect')
      this.wait()
    },
    wait () {
      if (!this.yourTurn) {
        setTimeout(() => {
          this.$store.dispatch('wait')
          this.wait()
        }, 1500)
      }
    }
  },

  mounted () {
    this.wait()
  },

  computed: {
    playerField () {
      return this.$store.getters.playerField
    },
    enemyField () {
      return this.$store.getters.enemyField
    },
    cellType () {
      return this.$store.getters.cellType
    },
    yourTurn () {
      return this.$store.getters.yourTurn
    },
    enemyName () {
      return this.$store.getters.enemyName
    },
    userName () {
      return this.$store.getters.userName
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/mixins';
@import '../../assets/common';

.row {
  flex-direction: columns;
  justify-content: space-around;
}

.wrap {
  margin: 5px;
}

.battleground {
  width: 402px;
  height: 402px;
  border: 1px solid #aaa;
  border-radius: 4px;
  display: flex;
  flex-flow: row wrap;

  .cell{
    max-width: 40px;
    height: 40px;
    border: 1px dotted rgba(#ccc, 0.5);
    flex: 0 0 20%;
    align-self: center;

    &.empty{ background-color: #fff; }
    &.selected { background-color: green; }
    &.closed { background-color: red; }
    &.blocked { background-color: rgb(250, 74, 103); }
    &.missed { background-color: pink; }
    &.intact { background-color: greenyellow; }
  }
}

</style>
