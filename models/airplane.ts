export class Airplane {
  SEATS_PER_ROW = 6;
  id: string;
  rows: number;
  seats: number[][];

  constructor(id: string, rows: number) {
    this.id = id;
    this.rows = rows;
    this.seats = Array.from({ length: rows }, () =>
      Array(this.SEATS_PER_ROW).fill(0)
    );
  }

  private convertIndexToSeatCode(i: number, j: number): string {
    let row: string = "";
    if (i + 1 < 10) {
      row = "0" + (i + 1).toString();
    } else {
      row = (i + 1).toString();
    }

    let seat: string = "";

    switch (j) {
      case 0:
        seat = "A";
        break;
      case 1:
        seat = "B";
        break;
      case 2:
        seat = "C";
        break;
      case 3:
        seat = "D";
        break;
      case 4:
        seat = "E";
        break;
      case 5:
        seat = "F";
        break;
    }

    return row + seat;
  }

  private convertSeatCodeToIndex(row: number, seat: string): [number, number] {
    const i: number = row - 1;
    let j: number = -1;

    const seatUpperCase = seat.toUpperCase();

    switch (seatUpperCase) {
      case "A":
        j = 0;
        break;
      case "B":
        j = 1;
        break;
      case "C":
        j = 2;
        break;
      case "D":
        j = 3;
        break;
      case "E":
        j = 4;
        break;
      case "F":
        j = 5;
        break;
    }

    if (row < 1 || row > this.rows || j === -1) {
      throw new Error(`Invalid format`);
    }

    return [i, j];
  }

  reserveSeat(row: number, seat: string): void {
    const [i, j] = this.convertSeatCodeToIndex(row, seat);

    this.seats[i][j] = 1;
  }

  clearSeat(row: number, seat: string): void {
    const [i, j] = this.convertSeatCodeToIndex(row, seat);

    this.seats[i][j] = 0;
  }

  clearAllSeats(): void {
    this.seats.forEach((row) => {
      row.fill(0);
    });
  }

  isAirplaneFull(): boolean {
    for (const row of this.seats) {
      for (const seat of row) {
        if (seat === 0) {
          return false;
        }
      }
    }
    return true;
  }

  displaySeats(): void {
    for (let i = 0; i < this.rows; i++) {
      let rowToPrint: string[] = [];
      for (let j = 0; j < this.SEATS_PER_ROW; j++) {
        if (this.seats[i][j] === 0) {
          rowToPrint.push(this.convertIndexToSeatCode(i, j));
        } else {
          rowToPrint.push(" X ");
        }
      }
      console.log(
        `|${rowToPrint[0]}  ${rowToPrint[1]}  ${rowToPrint[2]}      ${rowToPrint[3]}  ${rowToPrint[4]}  ${rowToPrint[5]}|`
      );
      console.log(`|                                |`);
    }
  }
}
