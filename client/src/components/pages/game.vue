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
      button.button(
        @click="reconect()"
        v-if="yourTurn !== null"
        ) Переподключиться
      button.button(
        v-if="yourTurn === null"
        @click="exit()"
        ) Выйти
</template>

<script>
export default {
  name: 'prepairing',
  data () {
    return {
      selectedCell: {},
      canShoot: true
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
      if (this.yourTurn && this.canShoot) {
        const point = this.selectedCell
        if (point !== {} && point.type === this.cellType.SELECTED) {
          this.canShoot = false
          this.$store.dispatch('shot', { x: point.x, y: point.y })
            .then(() => { this.canShoot = true })
        }
      }
    },
    reconect () {
      this.$store.dispatch('reconnect')
      this.wait()
    },
    wait () {
      setTimeout(() => {
        if (!this.yourTurn) {
          this.$store.dispatch('wait')
          this.wait()
        }
      }, 1500)
    },
    exit () {
      this.$router.replace('/')
    }
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
  },

  watch: {
    yourTurn (newValue, oldValue) {
      if (newValue === false) {
        this.wait()
      }
    }
  },

  mounted () {
    if (!this.yourTurn) {
      this.wait()
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

    &.closed { background-color: rgb(187, 35, 35); }
    &.missed { background-color: rgb(75, 91, 95); }

    &.empty{ background-color: rgb(170, 238, 255); }
    &.intact, &.selected { background-color: rgb(90, 90, 90); }
    &.blocked { background-color: rgb(241, 135, 153) ; }
  }
}

</style>
