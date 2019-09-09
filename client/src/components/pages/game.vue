<template lang="pug">
  div
    .row
      .battleground
        .cell(
          v-for="(cell, index) in playerField"
          :class="cell.type"
        )

      .battleground
        .cell(
          v-for="(cell, index) in enemyField"
          @mouseover="selectCell(cell.x, cell.y)"
          @click="shot()"
          :class="cell.type"
        )

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
      const point = this.selectedCell
      this.$store.dispatch('shot', point)
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/mixins';

.row {
  display: flex;
  flex-direction: columns;
  flex-wrap: wrap;
  flex-basis: 100%;
  flex: 1;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin: 10px 0;
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
  }
}

</style>
