<template>
  <main class="bg-blue-100">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex">
      <div
        v-for="(column, columnIndex) in row"
        :key="columnIndex"
        class="shadow bg-white w-10 h-10 flex items-center justify-center m-1"
        :class="{ 'bg-gray-100': board[rowIndex][columnIndex].revealed }"
        @contextmenu.prevent="cellRightClicked(rowIndex, columnIndex)"
        @click="cellLeftClicked(rowIndex, columnIndex)"
      >
        <p v-if="board[rowIndex][columnIndex].revealed">
          {{ board[rowIndex][columnIndex].flagged ? '🚩' : null }}
          {{ board[rowIndex][columnIndex].isBomb ? '💣' : null }}
          {{ board[rowIndex][columnIndex].adjacentBombs }}
        </p>
        <!-- {{ board[rowIndex][columnIndex].adjacentBombs ?? null }} -->
        <!-- {{ board[rowIndex][columnIndex] }} -->
      </div>
    </div>
    {{ won }}
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Cell {
  isBomb: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentBombs: number;
}

export default defineComponent({
  name: 'App',
  data(): {
    gridSize: number;
    board: Array<Array<Cell>>;
    won: null | boolean;
    totalBombs: number;
  } {
    return {
      gridSize: 9,
      board: [],
      won: null,
      totalBombs: 3,
    };
  },
  methods: {
    populateBoard(): void {
      for (let rowIndex = 0; rowIndex < this.gridSize; rowIndex++) {
        this.board.push([]);
        for (let columnIndex = 0; columnIndex < this.gridSize; columnIndex++) {
          this.board[rowIndex][columnIndex] = {
            revealed: false,
            isBomb: false,
            flagged: false,
            adjacentBombs: 0,
          };
        }
      }
    },
    getRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    drawBombs() {
      for (let i = 0; i < this.totalBombs; i++) {
        const rowIndex = this.getRandomNumber(0, this.gridSize - 1);
        const colIndex = this.getRandomNumber(0, this.gridSize - 1);
        this.board[rowIndex][colIndex].isBomb = true;
      }
    },
    cellRightClicked(rowIndex: number, columnIndex: number) {
      this.board[rowIndex][columnIndex].flagged = true;
    },
    cellLeftClicked(rowIndex: number, columnIndex: number) {
      const currentCell = this.board[rowIndex][columnIndex];
      if (currentCell.isBomb) this.won = false;

      this.numberOfAdjacentBombs(rowIndex, columnIndex);

      currentCell.revealed = true;
    },
    numberOfAdjacentBombs(rowIndex: number, columnIndex: number) {
      let counter = this.board[rowIndex][columnIndex].adjacentBombs;

      let cell1 = this.getCell(rowIndex - 1, columnIndex - 1);
      if (cell1 && cell1.isBomb) counter++;

      let cell2 = this.getCell(rowIndex - 1, columnIndex);
      if (cell2 && cell2.isBomb) counter++;

      let cell3 = this.getCell(rowIndex - 1, columnIndex + 1);
      if (cell3 && cell3.isBomb) counter++;

      let cell4 = this.getCell(rowIndex, columnIndex + 1);
      if (cell4 && cell4.isBomb) counter++;

      let cell5 = this.getCell(rowIndex, columnIndex - 1);
      if (cell5 && cell5.isBomb) counter++;

      let cell6 = this.getCell(rowIndex + 1, columnIndex - 1);
      if (cell6 && cell6.isBomb) counter++;

      let cell7 = this.getCell(rowIndex + 1, columnIndex);
      if (cell7 && cell7.isBomb) counter++;

      let cell8 = this.getCell(rowIndex + 1, columnIndex + 1);
      if (cell8 && cell8.isBomb) counter++;

      this.board[rowIndex][columnIndex].adjacentBombs = counter;
    },
    getCell(rowIndex: number, colIndex: number): Cell | null {
      try {
        return this.board[rowIndex][colIndex];
      } catch {
        return null;
      }
    },
  },
  created() {
    this.populateBoard();
    this.drawBombs();
  },
});
</script>

<style></style>
