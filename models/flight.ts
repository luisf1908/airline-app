import { Airport, FlightTicket, Airplane } from "./index";

export class Flight {
  flightNumber: number;
  cost: number;
  origin: Airport;
  destination: Airport;
  departureDate: Date;
  arrivingDate: Date;
  duration: number; // in minutes
  tickets: FlightTicket[];

  constructor(
    flightNumber: number,
    cost: number,
    origin: Airport,
    destination: Airport,
    departureDate: Date,
    arrivingDate: Date,
    duration: number
  ) {
    this.flightNumber = flightNumber;
    this.cost = cost;
    this.origin = origin;
    this.destination = destination;
    this.departureDate = departureDate;
    this.arrivingDate = arrivingDate;
    this.duration = duration;
    this.tickets = [];
  }
}
