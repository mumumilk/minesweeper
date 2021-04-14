<template>
  <div class="bg-gray-50 w-full min-h-screen grid place-items-center">
    <div class="flex flex-col items-center space-y-5">
      <h1 class="text-5xl font-extrabold text-blue-400">Minesweeper</h1>
      <button
        @click="initializeGame"
        class="text-6xl p-2 rounded-lg focus:outline-none transform hover:scale-105 duration-150"
      >
        {{ emoji }}
      </button>
      <main class="p-5 bg-blue-100 rounded" :style="gridStyle">
        <template v-for="(row, rowIndex) in board" :key="`${rowIndex}`">
          <Cell
            v-for="(column, columnIndex) in row"
            :key="`${rowIndex}${columnIndex}`"
            :cell="getCell(rowIndex, columnIndex)"
            @right-click="cellRightClicked"
            @left-click="cellLeftClicked"
          />
        </template>
      </main>
      <a
        class="text-blue-400"
        href="https://github.com/mumumilk/minesweeper"
        target="_blank"
        >Check me on github</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import Cell from './components/Cell.vue';
import { defineComponent } from 'vue';

interface Cell {
  isBomb: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentBombs: number;
  rowIndex: number;
  columnIndex: number;
}

export default defineComponent({
  components: {
    Cell,
  },
  name: 'Game',
  data(): {
    gridSize: number;
    board: Array<Array<Cell>>;
    won: null | boolean;
    totalBombs: number;
    totalRevealed: number;
  } {
    return {
      gridSize: 9,
      board: [],
      won: null,
      totalBombs: 10,
      totalRevealed: 0,
    };
  },
  computed: {
    emoji() {
      switch (this.won) {
        case true:
          return '😎';
        case false:
          return '😣';
        default:
          return '🙂';
      }
    },
    gridStyle(): {} {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${this.gridSize}, minmax(auto, 1fr))`,
      };
    },
  },
  methods: {
    hasWon() {
      return (
        this.gridSize * this.gridSize == this.totalRevealed + this.totalBombs
      );
    },
    initializeGame() {
      this.board = [];
      this.won = null;
      this.totalRevealed = 0;
      this.populateBoard();
      this.drawBombs();
    },
    populateBoard() {
      for (let rowIndex = 0; rowIndex < this.gridSize; rowIndex++) {
        this.board.push([]);
        for (let columnIndex = 0; columnIndex < this.gridSize; columnIndex++) {
          this.board[rowIndex][columnIndex] = {
            rowIndex: rowIndex,
            columnIndex: columnIndex,
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
      let i = 0;
      while (i < this.totalBombs) {
        const cell = this.getCell(
          this.getRandomNumber(0, this.gridSize - 1),
          this.getRandomNumber(0, this.gridSize - 1)
        );

        if (cell && !cell.isBomb) {
          cell.isBomb = true;

          for (let neighbour of this.getCellNeighbours(cell)) {
            neighbour.adjacentBombs++;
          }

          i++;
        }
      }
    },
    getCellNeighbours(cell: Cell): Array<Cell> {
      return [
        [cell.rowIndex - 1, cell.columnIndex - 1],
        [cell.rowIndex - 1, cell.columnIndex],
        [cell.rowIndex - 1, cell.columnIndex + 1],
        [cell.rowIndex, cell.columnIndex + 1],
        [cell.rowIndex, cell.columnIndex - 1],
        [cell.rowIndex + 1, cell.columnIndex - 1],
        [cell.rowIndex + 1, cell.columnIndex],
        [cell.rowIndex + 1, cell.columnIndex + 1],
      ]
        .map((indexPair) => this.getCell(indexPair[0], indexPair[1]))
        .filter((neighbour): neighbour is Cell => !!neighbour);
    },
    cellRightClicked(cell: Cell) {
      if (this.won == null && cell) {
        if (cell && !cell.revealed) {
          cell.flagged = !cell.flagged;
        }
      }

      if (this.hasWon()) this.won = true;
    },
    cellLeftClicked(cell: Cell) {
      if (this.won == null && cell) {
        if (cell.isBomb) {
          cell.revealed = true;
          this.won = false;
        } else {
          this.reveal(cell);
        }
      }

      if (this.hasWon()) this.won = true;
    },
    reveal(cell: Cell) {
      if (cell.isBomb) {
        cell.revealed = true;
        this.won = false;
        return;
      }

      if (!cell.revealed && !cell.flagged) {
        cell.revealed = true;
        this.totalRevealed++;

        if (cell.adjacentBombs == 0) {
          for (let neighbour of this.getCellNeighbours(cell)) {
            this.reveal(neighbour);
          }
        }
      }
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
    this.initializeGame();
  },
});
</script>
