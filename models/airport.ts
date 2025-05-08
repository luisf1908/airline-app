import { Flight, City, Airplane, Country, State } from "./index";
import promptSync from "prompt-sync";
const prompt = promptSync();

export class Airport {
  airportId: string;
  city: City;
  flights: Flight[];

  constructor(airportId: string, city: City) {
    this.airportId = airportId;
    this.city = city;
    this.flights = [];
  }

  addFlight(
    flightNumber: number,
    airplane: Airplane,
    cost: number,
    origin: Airport,
    destination: Airport,
    departureDate: Date,
    arrivingDate: Date,
    duration: number
  ): void {
    this.flights.push(
      new Flight(
        flightNumber,
        airplane,
        cost,
        origin,
        destination,
        departureDate,
        arrivingDate,
        duration
      )
    );
  }
}

class AirportGraph {
  airports: Map<string, Airport>;

  constructor() {
    this.airports = new Map();
  }

  addAirport(airportId: string, city: City): void {
    this.airports.set(airportId, new Airport(airportId, city));
  }

  getAirport(airportId: string): Airport | undefined {
    return this.airports.get(airportId);
  }

  addAirportFlightConnection(
    flightNumber: number,
    airplane: Airplane,
    cost: number,
    originId: string,
    destinationId: string,
    departureDate: Date,
    arrivingDate: Date,
    duration: number
  ): void {
    const origin = this.getAirport(originId);
    const destination = this.getAirport(destinationId);

    if (!origin || !destination) {
      return;
    }

    origin.addFlight(
      flightNumber,
      airplane,
      cost,
      origin,
      destination,
      departureDate,
      arrivingDate,
      duration
    );
  }

  removeFlightConnection(airportId: string, flightNumber: number): void {
    const airport = this.getAirport(airportId);

    if (!airport) {
      return;
    }

    airport.flights = airport.flights.filter(
      (flight) => flight.flightNumber !== flightNumber
    );
  }

  filterAirportFlightsByDate(
    airport: Airport,
    day: number,
    month: number,
    year: number
  ): Flight[] | undefined {
    const filteredFlights = airport?.flights.filter(
      (flight) =>
        flight.departureDate.getUTCFullYear() === year &&
        flight.departureDate.getUTCMonth() === month - 1 && //getUTCMonth() returns a number from 0-11, so the comparison is with month-1
        flight.departureDate.getUTCDate() === day
    );

    return filteredFlights;
  }

  filterNationalAirportFlights(airportId: string): Flight[] | undefined {
    const airport = this.getAirport(airportId);

    const filteredFlights = airport?.flights.filter(
      (flight) =>
        flight.origin.city.stateId.countryId ===
        flight.destination.city.stateId.countryId
    );

    return filteredFlights;
  }

  filterInternationalAirportFlights(airportId: string): Flight[] | undefined {
    const airport = this.getAirport(airportId);

    const filteredFlights = airport?.flights.filter(
      (flight) =>
        flight.origin.city.stateId.countryId !==
        flight.destination.city.stateId.countryId
    );

    return filteredFlights;
  }

  filterAirportFlightsByTicketAvailability(
    airportId: string,
    ticketQty: number
  ): Flight[] | undefined {
    const airport = this.getAirport(airportId);

    const filteredFlights = airport?.flights.filter(
      (flight) => flight.areTicketsAvailable(ticketQty) === true
    );

    return filteredFlights;
  }

  filterAirportFlightsByLayoverSuitability(
    airportId: string,
    arrivingDate: Date
  ): Flight[] | undefined {
    const airport = this.getAirport(airportId);

    const MAX_LAYOVER_TIME_IN_HOURS: number = 16;

    const minimumDepartureDate = new Date(arrivingDate);
    const maximumDepartureDate = new Date(arrivingDate);

    minimumDepartureDate.setUTCHours(minimumDepartureDate.getUTCHours() + 1);
    maximumDepartureDate.setUTCHours(
      maximumDepartureDate.getUTCHours() + MAX_LAYOVER_TIME_IN_HOURS
    );

    const filteredFlights = airport?.flights.filter(
      (flight) =>
        flight.departureDate > minimumDepartureDate === true &&
        flight.departureDate < maximumDepartureDate === true
    );

    return filteredFlights;
  }

  searchFlightsInputs():
    | {
        origin: Airport;
        destination: Airport;
        tripDay: number;
        tripMonth: number;
        tripYear: number;
      }
    | undefined {
    const originId = prompt("Origin Airport ID: ").toUpperCase();
    const destinationId = prompt("Destination Airport ID: ").toUpperCase();
    const tripDay = Number(prompt("Day (1-31): "));
    const tripMonth = Number(prompt("Month (1-12): "));
    const tripYear = Number(prompt("Year: "));

    const origin = this.getAirport(originId);
    const destination = this.getAirport(destinationId);

    //Error Handling
    const currentDate = new Date();

    const tripDate = new Date();
    tripDate.setUTCDate(tripDay);
    tripDate.setUTCMonth(tripMonth - 1);
    tripDate.setUTCFullYear(tripYear);

    if (!originId || !destinationId || !tripDay || !tripMonth || !tripYear) {
      console.log("Invalid input");
      return;
    }
    if (!origin) {
      console.log("Origin airport is not available");
      return;
    }
    if (!destination) {
      console.log("Destination airport is not available");
      return;
    }
    if (
      tripDay < 1 ||
      tripDay > 31 ||
      tripMonth < 1 ||
      tripMonth > 12 ||
      tripDate < currentDate
    ) {
      console.log("Invalid Date");
      return;
    }
    //End of error handling

    return {
      origin: origin,
      destination: destination,
      tripDay: tripDay,
      tripMonth: tripMonth,
      tripYear: tripYear,
    };
  }

  searchFlight(): Flight[][] | undefined {
    const inputs = this.searchFlightsInputs();
    if (!inputs) {
      return;
    }
    const { origin, destination, tripDay, tripMonth, tripYear } = inputs;

    const tripsAvailable: Flight[][] = [];

    const filteredFlightsByDate = this.filterAirportFlightsByDate(
      origin,
      tripDay,
      tripMonth,
      tripYear
    );

    if (!filteredFlightsByDate) {
      console.log("No flights were found on this date");
      return;
    }

    const directFlights = filteredFlightsByDate.filter(
      (flight) => flight.destination === destination
    );

    if (directFlights.length > 0) {
      for (const flight of directFlights) {
        tripsAvailable.push([flight]);
      }
    }

    console.log(tripsAvailable);
  }
}

// Test code
const country1 = new Country("Costa Rica");
const country2 = new Country("Panama");
const country3 = new Country("Colombia");

const state1 = new State("San Jose", country1);
const state2 = new State("Chiriqui", country2);
const state3 = new State("Antioquia", country3);

const city1 = new City("Montes de Oca", state1);
const city2 = new City("David", state2);
const city3 = new City("Medellin", state3);

const airplane1 = new Airplane("A579", 12);
const airplane2 = new Airplane("A684", 12);
const airplane3 = new Airplane("A987", 12);

const graph = new AirportGraph();
graph.addAirport("SJO", city1);
graph.addAirport("PTY", city2);
graph.addAirport("MDE", city3);

graph.addAirportFlightConnection(
  876,
  airplane1,
  100,
  "SJO",
  "PTY",
  new Date("2025-06-25T03:25:00Z"),
  new Date("2025-06-25T05:30:00Z"),
  120
);

graph.addAirportFlightConnection(
  924,
  airplane2,
  100,
  "SJO",
  "MDE",
  new Date("2025-06-25T06:48:00Z"),
  new Date("2025-06-25T07:05:00Z"),
  120
);

graph.addAirportFlightConnection(
  545,
  airplane3,
  100,
  "SJO",
  "MDE",
  new Date("2025-06-26T20:07:00Z"),
  new Date("2025-06-26T23:14:00Z"),
  120
);

graph.searchFlight();
