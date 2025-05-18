import { Passenger, FlightReservation } from "./index";

export class FlightTicket {
  reservation: FlightReservation;
  passenger: Passenger;
  seat: string;
  boardingGroup: string;
  gate: string;
  isCheckedIn: boolean;

  constructor(
    passenger: Passenger,
    reservation: FlightReservation,
    seat: string
  ) {
    this.reservation = reservation;
    this.passenger = passenger;
    this.seat = seat;
    this.boardingGroup = "";
    this.gate = "";
    this.isCheckedIn = false;
  }

  printBoardingPass(): void {}
}
