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

  /*filterNationalAirportFlights(airport: Airport): Flight[] | undefined {
    const filteredFlights = airport?.flights.filter(
      (flight) =>
        flight.origin.city.stateId.countryId ===
        flight.destination.city.stateId.countryId
    );

    return filteredFlights;
  }

  filterInternationalAirportFlights(airport: Airport): Flight[] | undefined {
    const filteredFlights = airport?.flights.filter(
      (flight) =>
        flight.origin.city.stateId.countryId !==
        flight.destination.city.stateId.countryId
    );

    return filteredFlights;
  }
*/

  filterAirportFlightsByTicketAvailability(
    flights: Flight[],
    ticketQty: number
  ): Flight[] | undefined {
    const filteredFlights = flights.filter(
      (flight) => flight.areTicketsAvailable(ticketQty) === true
    );

    return filteredFlights;
  }

  filterAirportFlightsByLayoverSuitability(
    airport: Airport,
    arrivingDate: Date
  ): Flight[] | undefined {
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
        ticketQty: number;
      }
    | undefined {
    const originId = prompt("Origin Airport ID: ").toUpperCase();
    const destinationId = prompt("Destination Airport ID: ").toUpperCase();
    const tripDay = Number(prompt("Day (1-31): "));
    const tripMonth = Number(prompt("Month (1-12): "));
    const tripYear = Number(prompt("Year: "));
    const ticketQty = Number(prompt("Ticket quantity: "));

    const origin = this.getAirport(originId);
    const destination = this.getAirport(destinationId);

    //Error Handling
    const currentDate = new Date();

    const tripDate = new Date();
    tripDate.setUTCDate(tripDay);
    tripDate.setUTCMonth(tripMonth - 1);
    tripDate.setUTCFullYear(tripYear);

    if (
      !originId ||
      !destinationId ||
      !tripDay ||
      !tripMonth ||
      !tripYear ||
      !ticketQty
    ) {
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

    if (ticketQty < 1) {
      console.log("Invalid ticket quantity");
      return;
    }
    //End of error handling

    return {
      origin: origin,
      destination: destination,
      tripDay: tripDay,
      tripMonth: tripMonth,
      tripYear: tripYear,
      ticketQty: ticketQty,
    };
  }

  searchFlight(): Flight[][] | undefined {
    const inputs = this.searchFlightsInputs();
    if (!inputs) {
      return;
    }
    const { origin, destination, tripDay, tripMonth, tripYear, ticketQty } =
      inputs;

    const tripsAvailable: Flight[][] = [];

    //Search for direct flights
    const originFlightsFilter1 = this.filterAirportFlightsByDate(
      origin,
      tripDay,
      tripMonth,
      tripYear
    );

    if (!originFlightsFilter1 || originFlightsFilter1.length === 0) {
      console.log("No flights were found");
      return;
    }

    const originFlightsFilter2 = this.filterAirportFlightsByTicketAvailability(
      originFlightsFilter1,
      ticketQty
    );

    if (!originFlightsFilter2 || originFlightsFilter2.length === 0) {
      console.log("No flights were found");
      return;
    }

    const originDirectFlights = originFlightsFilter2.filter(
      (flight) => flight.destination === destination
    );

    const originIndirectFlights = originFlightsFilter2.filter(
      (flight) => flight.destination !== destination
    );

    if (originDirectFlights.length > 0) {
      for (const flight of originDirectFlights) {
        tripsAvailable.push([flight]);
      }
    }

    if (!originIndirectFlights || originIndirectFlights.length === 0) {
      return tripsAvailable;
    }

    //Search for flight with one layover

    const layover1TotalIndirectFlights: Flight[][] = [];
    for (let i = 0; i < originIndirectFlights.length; i++) {
      const layover1Filter1 = this.filterAirportFlightsByLayoverSuitability(
        originIndirectFlights[i].destination,
        originIndirectFlights[i].arrivingDate
      );

      if (!layover1Filter1 || layover1Filter1.length === 0) {
        continue;
      }

      const layover1Filter2 = layover1Filter1.filter(
        (flight) => flight.destination !== originIndirectFlights[i].origin
      );

      if (!layover1Filter2 || layover1Filter2.length === 0) {
        continue;
      }

      const layover1Filter3 = this.filterAirportFlightsByTicketAvailability(
        layover1Filter2,
        ticketQty
      );

      if (!layover1Filter3 || layover1Filter3.length === 0) {
        continue;
      }

      const layover1DirectFlights = layover1Filter3.filter(
        (flight) => flight.destination === destination
      );

      const layover1IndirectFlights = layover1Filter3.filter(
        (flight) => flight.destination !== destination
      );

      if (layover1DirectFlights.length > 0) {
        for (const flight of layover1DirectFlights) {
          tripsAvailable.push([originIndirectFlights[i], flight]);
        }
      }

      if (layover1IndirectFlights.length > 0) {
        for (const flight of layover1IndirectFlights) {
          layover1TotalIndirectFlights.push([originIndirectFlights[i], flight]);
        }
      }
    }

    //Search for flights with two layovers

    for (let i = 0; i < layover1TotalIndirectFlights.length; i++) {
      const layover2Filter1 = this.filterAirportFlightsByLayoverSuitability(
        layover1TotalIndirectFlights[i][1].destination,
        layover1TotalIndirectFlights[i][1].arrivingDate
      );

      if (!layover2Filter1 || layover2Filter1.length === 0) {
        continue;
      }

      const layover2Filter2 = this.filterAirportFlightsByTicketAvailability(
        layover2Filter1,
        ticketQty
      );

      if (!layover2Filter2 || layover2Filter2.length === 0) {
        continue;
      }

      const layover2DirectFlights = layover2Filter2.filter(
        (flight) => flight.destination === destination
      );

      if (layover2DirectFlights.length > 0) {
        for (const flight of layover2DirectFlights) {
          tripsAvailable.push([
            layover1TotalIndirectFlights[i][0],
            layover1TotalIndirectFlights[i][1],
            flight,
          ]);
        }
      }
    }
    console.log(tripsAvailable);
    //console.log(layover1TotalIndirectFlights);
  }
}

// Test code
const country1 = new Country("Costa Rica");
const country2 = new Country("Panama");
const country3 = new Country("Colombia");
const country4 = new Country("Mexico");

const state1 = new State("San Jose", country1);
const state2 = new State("Chiriqui", country2);
const state3 = new State("Antioquia", country3);
const state4 = new State("Bogotá", country3);
const state5 = new State("Mexico DF", country4);

const city1 = new City("Montes de Oca", state1);
const city2 = new City("David", state2);
const city3 = new City("Medellin", state3);
const city4 = new City("Bogotá", state4);
const city5 = new City("Mexico DF", state4);

const airplane1 = new Airplane("A579", 12);
const airplane2 = new Airplane("A684", 12);
const airplane3 = new Airplane("A987", 12);

const graph = new AirportGraph();
graph.addAirport("SJO", city1);
graph.addAirport("PTY", city2);
graph.addAirport("MDE", city3);
graph.addAirport("BOG", city4);
graph.addAirport("MEX", city5);

//San Jose Flights
graph.addAirportFlightConnection(
  1,
  airplane1,
  100,
  "SJO",
  "BOG",
  new Date("2025-06-01T06:00:00Z"),
  new Date("2025-06-01T08:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  2,
  airplane1,
  100,
  "SJO",
  "BOG",
  new Date("2025-06-01T09:00:00Z"),
  new Date("2025-06-01T11:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  3,
  airplane1,
  100,
  "SJO",
  "MDE",
  new Date("2025-06-01T07:00:00Z"),
  new Date("2025-06-01T09:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  4,
  airplane1,
  100,
  "SJO",
  "MEX",
  new Date("2025-06-01T07:00:00Z"),
  new Date("2025-06-01T09:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  5,
  airplane1,
  100,
  "SJO",
  "PTY",
  new Date("2025-06-02T04:30:00Z"),
  new Date("2025-06-02T05:00:00Z"),
  120
);

//Bogota Flights

graph.addAirportFlightConnection(
  6,
  airplane1,
  100,
  "BOG",
  "MDE",
  new Date("2025-06-01T19:00:00Z"),
  new Date("2025-06-01T20:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  7,
  airplane1,
  100,
  "BOG",
  "MDE",
  new Date("2025-06-01T17:00:00Z"),
  new Date("2025-06-01T18:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  8,
  airplane1,
  100,
  "BOG",
  "SJO",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

//Panama Flights

graph.addAirportFlightConnection(
  9,
  airplane1,
  100,
  "PTY",
  "MDE",
  new Date("2025-06-01T20:00:00Z"),
  new Date("2025-06-01T22:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  10,
  airplane1,
  100,
  "PTY",
  "SJO",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

graph.addAirportFlightConnection(
  11,
  airplane1,
  100,
  "PTY",
  "BOG",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

//Mexico Flights

graph.addAirportFlightConnection(
  12,
  airplane1,
  100,
  "MEX",
  "SJO",
  new Date("2025-06-01T12:00:00Z"),
  new Date("2025-06-01T14:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  13,
  airplane1,
  100,
  "MEX",
  "PTY",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

//Medellin Flights

graph.addAirportFlightConnection(
  14,
  airplane1,
  100,
  "MDE",
  "BOG",
  new Date("2025-06-01T12:00:00Z"),
  new Date("2025-06-01T14:00:00Z"),
  120
);

console.log(graph.searchFlight());
