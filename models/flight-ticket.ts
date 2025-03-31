import { Passenger, FlightReservation } from "./index";

export class FlightTicket {
  reservation: FlightReservation;
  passenger: Passenger;
  seat: string;
  boardingGroup: string;
  gate: string;

  constructor(
    passenger: Passenger,
    reservation: FlightReservation,
    seat: string,
    boardingGroup: string,
    gate: string
  ) {
    this.reservation = reservation;
    this.passenger = passenger;
    this.seat = seat;
    this.boardingGroup = boardingGroup;
    this.gate = gate;
  }
}
