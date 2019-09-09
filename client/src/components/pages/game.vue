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
          @click="shot(cell.x, cell.y)"
          :class="cell.type"
        )

</template>

<script>
export default {
  name: 'prepairing',
  data () {
    return {}
  },

  methods: {
    shot (x, y) {}
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
  justify-content: center;
  width: 100%;
  margin: 10px 0;
}

.battleground {
  width: 251;
  height: 251;
  border: 1px solid #aaa;
  border-radius: 4px;
  display: flex;
  flex-flow: row wrap;

  .cell{
    max-width: 25px;
    height: 25px;
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
