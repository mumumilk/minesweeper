<template>
  <div
    class="rounded bg-white w-10 h-10 flex items-center justify-center m-1"
    :class="{
      'bg-blue-200': cell.revealed,
      shadow: !cell.revealed,
    }"
    @contextmenu.prevent="() => $emit('right-click', cell)"
    @click="() => $emit('left-click', cell)"
  >
    <span v-if="cell.revealed">
      {{
        cell.isBomb
          ? '💣'
          : cell.adjacentBombs > 0
          ? cell.adjacentBombs
          : undefined
      }}
    </span>
    <span v-else-if="cell.flagged">🚩</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['left-click', 'right-click'],
  props: ['cell'],
});
</script>

<style></style>
