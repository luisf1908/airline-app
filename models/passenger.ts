import { User, FlightReservation } from "./index";

export class Passenger extends User {
  passportId: string;
  reservations: FlightReservation[];

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    passportId: string
  ) {
    super(firstName, lastName, email);
    this.passportId = passportId;
    this.reservations = [];
  }
}
