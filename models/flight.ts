import { Airport, FlightTicket, Airplane, Country, State, City } from "./index";

export class Flight {
  flightNumber: number;
  airplane: Airplane;
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
    this.airplane = new Airplane("B787", 15);
    this.cost = cost;
    this.origin = origin;
    this.destination = destination;
    this.departureDate = departureDate;
    this.arrivingDate = arrivingDate;
    this.duration = duration;
    this.tickets = [];
  }

  deconstructDateDataType(
    dateDataType: Date
  ): [string, number, number, number, number] {
    const month = dateDataType.getUTCMonth();
    let monthString: string = "";
    const day = dateDataType.getUTCDate();
    const year = dateDataType.getUTCFullYear();

    const hour = dateDataType.getUTCHours();
    const minutes = dateDataType.getUTCMinutes();

    switch (month) {
      case 0:
        monthString = "January";
        break;
      case 1:
        monthString = "February";
        break;
      case 2:
        monthString = "March";
        break;
      case 3:
        monthString = "April";
        break;
      case 4:
        monthString = "May";
        break;
      case 5:
        monthString = "June";
        break;
      case 6:
        monthString = "July";
        break;
      case 7:
        monthString = "August";
        break;
      case 8:
        monthString = "September";
        break;
      case 9:
        monthString = "October";
        break;
      case 10:
        monthString = "November";
        break;
      case 11:
        monthString = "December";
        break;
    }

    return [monthString, day, year, hour, minutes];
  }

  areTicketsAvailable(ticketQty: number): boolean {
    const totalTickets = this.airplane.SEATS_PER_ROW * this.airplane.rows;

    const ticketsAvailable = totalTickets - this.tickets.length;

    if (ticketsAvailable >= ticketQty) {
      return true;
    } else {
      return false;
    }
  }

  displayFlightInformationSummary(): void {}
}

/*const country1 = new Country("Costa Rica");
const state1 = new State("San Jose", country1);
const city1 = new City("Montes de Oca", state1);

const airport1 = new Airport("SJO", city1);
const airport2 = new Airport("PNA", city1);
const airport3 = new Airport("MDE", city1);

const airplane1 = new Airplane("A579", 12);
const airplane2 = new Airplane("A684", 12);
const airplane3 = new Airplane("A987", 12);

const flight1 = new Flight(
  876,
  airplane1,
  100,
  airport1,
  airport2,
  new Date("2025-04-25T14:37:00Z"),
  new Date("2025-04-25T16:42:00Z"),
  120
);

console.log(flight1.departureDate);
console.log(flight1.deconstructDateDataType(flight1.departureDate));*/
