import { Airport, FlightTicket } from "./index";

export class Flight {
  flightNumber: number;
  origin: Airport;
  destination: Airport;
  departureDate: Date;
  arrivingDate: Date;
  duration: number; // in minutes
  tickets: FlightTicket[];

  constructor(
    flightNumber: number,
    origin: Airport,
    destination: Airport,
    departureDate: Date,
    arrivingDate: Date,
    duration: number
  ) {
    this.flightNumber = flightNumber;
    this.origin = origin;
    this.destination = destination;
    this.departureDate = departureDate;
    this.arrivingDate = arrivingDate;
    this.duration = duration;
    this.tickets = [];
  }
}
