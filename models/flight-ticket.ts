import { Passenger, FlightReservation, Flight } from "./index";

export class FlightTicket {
  reservation: FlightReservation;
  flight: Flight;
  passenger: Passenger;
  seat: string;
  boardingGroup: string;
  isCheckedIn: boolean;

  constructor(
    reservation: FlightReservation,
    flight: Flight,
    passenger: Passenger,
    seat: string
  ) {
    this.reservation = reservation;
    this.flight = flight;
    this.passenger = passenger;
    this.seat = seat;
    this.boardingGroup = "";
    this.isCheckedIn = false;
  }

  private getBoardingGroup(): string {
    const seatNumber = Number(this.seat.slice(0, -1));

    if (seatNumber < 6) {
      return "A";
    } else if (seatNumber >= 6 && seatNumber < 11) {
      return "B";
    } else if (seatNumber >= 11 && seatNumber < 16) {
      return "C";
    } else if (seatNumber >= 16 && seatNumber < 21) {
      return "D";
    } else if (seatNumber >= 21 && seatNumber < 26) {
      return "E";
    } else {
      return "F";
    }
  }

  printBoardingPass(): void {
    console.log(
      "************************  BOARDING PASS  ************************\n"
    );

    console.log(`Flight number: ${this.flight.flightNumber}\n`);
    console.log(
      `From ${this.flight.origin.city.name} to ${this.flight.destination.city.name}\n`
    );
    console.log(
      `Passenger: ${this.passenger.firstName} ${this.passenger.lastName}\n`
    );
    console.log(`Seat: ${this.seat}`);
    console.log(`Boarding Group: ${this.getBoardingGroup()}`);
    console.log(`Gate: ${this.flight.departureGate}\n`);
  }
}
