import { Flight, City, Airplane, Country, State, Itinerary } from "./index";
import promptSync from "prompt-sync";
const prompt = promptSync();

export class Airport {
  airportId: string;
  city: City;
  gatesQty: number;
  flights: Flight[];

  constructor(airportId: string, city: City, gatesQty: number) {
    this.airportId = airportId;
    this.city = city;
    this.gatesQty = gatesQty;
    this.flights = [];
  }

  addFlight(
    flightNumber: number,
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

export class AirportGraph {
  airports: Map<string, Airport>;

  constructor() {
    this.airports = new Map();
  }

  private displayAirports(): void {
    console.log("//  Airports available  //\n");

    for (const [airportId, airport] of this.airports.entries()) {
      console.log(
        `${airportId}: ${airport.city.name}, ${airport.city.stateId.countryId.name}`
      );
    }
    console.log("\n");
  }

  addAirport(airportId: string, city: City, gatesQty: number): void {
    this.airports.set(airportId, new Airport(airportId, city, gatesQty));
  }

  getAirport(airportId: string): Airport | undefined {
    return this.airports.get(airportId);
  }

  addAirportFlightConnection(
    flightNumber: number,
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

  private findDirectFlights(
    flights: Flight[],
    tripDestination: Airport
  ): Flight[] {
    return flights.filter((flight) => flight.destination === tripDestination);
  }

  private findIndirectFlights(
    flights: Flight[],
    tripDestination: Airport
  ): Flight[] {
    return flights.filter((flight) => flight.destination !== tripDestination);
  }

  //Filter function that filters flights by an specific date and also filters by ticket availability
  private filterOriginFlights(
    tripOriginAirport: Airport,
    tripDestinationAirport: Airport,
    day: number,
    month: number,
    year: number,
    ticketQty: number
  ): [Flight[], Flight[]] {
    const filteredFlights = tripOriginAirport?.flights.filter(
      (flight) =>
        flight.departureDate.getUTCFullYear() === year &&
        flight.departureDate.getUTCMonth() === month - 1 && //getUTCMonth() returns a number from 0-11, so the comparison is with month-1
        flight.departureDate.getUTCDate() === day &&
        flight.areTicketsAvailable(ticketQty) === true
    );

    const directFlights = this.findDirectFlights(
      filteredFlights,
      tripDestinationAirport
    );
    const indirectFlights = this.findIndirectFlights(
      filteredFlights,
      tripDestinationAirport
    );

    return [directFlights, indirectFlights];
  }

  //Filter function that filters flights by layover suitability and also filters by ticket availability
  private filterLayoverFlights(
    layoverPreviousAirport: Airport,
    layoverAirport: Airport,
    tripDestinationAirport: Airport,
    arrivingDate: Date,
    ticketQty: number
  ): [Flight[], Flight[]] {
    const MIN_LAYOVER_TIME_IN_HOURS: number = 1;
    const MAX_LAYOVER_TIME_IN_HOURS: number = 16;

    const minimumDepartureDate = new Date(arrivingDate);
    const maximumDepartureDate = new Date(arrivingDate);

    minimumDepartureDate.setUTCHours(
      minimumDepartureDate.getUTCHours() + MIN_LAYOVER_TIME_IN_HOURS
    );
    maximumDepartureDate.setUTCHours(
      maximumDepartureDate.getUTCHours() + MAX_LAYOVER_TIME_IN_HOURS
    );

    const filteredFlights = layoverAirport?.flights.filter(
      (flight) =>
        flight.departureDate > minimumDepartureDate === true &&
        flight.departureDate < maximumDepartureDate === true &&
        flight.destination !== layoverPreviousAirport &&
        flight.areTicketsAvailable(ticketQty) === true
    );

    const directFlights = this.findDirectFlights(
      filteredFlights,
      tripDestinationAirport
    );
    const indirectFlights = this.findIndirectFlights(
      filteredFlights,
      tripDestinationAirport
    );

    return [directFlights, indirectFlights];
  }

  private searchFlightsInputs():
    | {
        tripOrigin: Airport;
        tripDestination: Airport;
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

    console.log("\n");

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
      tripOrigin: origin,
      tripDestination: destination,
      tripDay: tripDay,
      tripMonth: tripMonth,
      tripYear: tripYear,
      ticketQty: ticketQty,
    };
  }

  private searchFlight(): {
    availableFlights: Flight[][] | undefined;
    passengerQty: number | undefined;
  } {
    this.displayAirports();

    const inputs = this.searchFlightsInputs();
    if (!inputs) {
      return { availableFlights: undefined, passengerQty: undefined };
    }
    const {
      tripOrigin,
      tripDestination,
      tripDay,
      tripMonth,
      tripYear,
      ticketQty,
    } = inputs;

    const tripsAvailable: Flight[][] = [];

    //Search for direct flights

    const [originDirectFlights, originIndirectFlights] =
      this.filterOriginFlights(
        tripOrigin,
        tripDestination,
        tripDay,
        tripMonth,
        tripYear,
        ticketQty
      );

    if (
      originDirectFlights.length === 0 &&
      originIndirectFlights.length === 0
    ) {
      console.log("No flights were found");
      return { availableFlights: undefined, passengerQty: undefined };
    }

    if (originDirectFlights.length > 0) {
      for (const flight of originDirectFlights) {
        tripsAvailable.push([flight]);
      }
    }

    if (originIndirectFlights.length === 0) {
      return { availableFlights: tripsAvailable, passengerQty: ticketQty };
    }

    //Search for flight with one layover

    const layover1TotalIndirectFlights: Flight[][] = [];

    for (let i = 0; i < originIndirectFlights.length; i++) {
      const [layover1DirectFlights, layover1IndirectFlights] =
        this.filterLayoverFlights(
          originIndirectFlights[i].origin,
          originIndirectFlights[i].destination,
          tripDestination,
          originIndirectFlights[i].arrivingDate,
          ticketQty
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
      const [layover2DirectFlights, layover2IndirectFlights] =
        this.filterLayoverFlights(
          layover1TotalIndirectFlights[i][1].origin,
          layover1TotalIndirectFlights[i][1].destination,
          tripDestination,
          layover1TotalIndirectFlights[i][1].arrivingDate,
          ticketQty
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
    return { availableFlights: tripsAvailable, passengerQty: ticketQty };
  }

  private selectTrip(trips: Flight[][]): Itinerary | undefined {
    const MAX_TRIPS_TO_DISPLAY: number = trips.length;

    const tripsToDisplay = trips.slice(0, MAX_TRIPS_TO_DISPLAY);

    const displayLoopLimit: number = Math.min(
      tripsToDisplay.length,
      MAX_TRIPS_TO_DISPLAY
    );

    console.log(
      "\n\n************************  TRIPS AVAILABLE  ************************\n\n"
    );

    for (let i = 0; i < displayLoopLimit; i++) {
      const itinerary = new Itinerary();
      console.log(`//  Option ${i + 1}  //\n`);

      itinerary.displayTripInformation(tripsToDisplay[i]);
      console.log(`\n\n`);
    }

    const userChoice = Number(
      prompt(
        "Choose your trip option or press any key to return to the main menu: "
      )
    );

    if (
      !userChoice ||
      isNaN(userChoice) ||
      userChoice < 1 ||
      userChoice > displayLoopLimit
    ) {
      return;
    }

    const selectedItinerary = new Itinerary();
    selectedItinerary.outboundTrip = tripsToDisplay[userChoice - 1];
    selectedItinerary.calculateTripCost(selectedItinerary.outboundTrip);

    return selectedItinerary;
  }

  tripSelection(): { itinerary: Itinerary; passengerQty: number } | undefined {
    const { availableFlights, passengerQty } = this.searchFlight();
    if (!availableFlights) {
      return;
    }
    if (!passengerQty || passengerQty < 1) {
      return;
    }

    const itinerary: Itinerary | undefined = this.selectTrip(availableFlights);

    if (!itinerary) {
      return;
    }

    return { itinerary, passengerQty };
  }
}

/*
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
  100,
  "SJO",
  "BOG",
  new Date("2025-06-01T06:00:00Z"),
  new Date("2025-06-01T08:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  2,
  100,
  "SJO",
  "BOG",
  new Date("2025-06-01T09:00:00Z"),
  new Date("2025-06-01T11:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  3,
  100,
  "SJO",
  "MDE",
  new Date("2025-06-01T07:00:00Z"),
  new Date("2025-06-01T09:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  4,
  100,
  "SJO",
  "MEX",
  new Date("2025-06-01T07:00:00Z"),
  new Date("2025-06-01T09:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  5,
  100,
  "SJO",
  "PTY",
  new Date("2025-06-01T04:30:00Z"),
  new Date("2025-06-01T05:00:00Z"),
  120
);

//Bogota Flights

graph.addAirportFlightConnection(
  6,
  100,
  "BOG",
  "MDE",
  new Date("2025-06-01T19:00:00Z"),
  new Date("2025-06-01T20:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  7,
  100,
  "BOG",
  "MDE",
  new Date("2025-06-01T17:00:00Z"),
  new Date("2025-06-01T18:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  8,
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
  100,
  "PTY",
  "MDE",
  new Date("2025-06-01T18:00:00Z"),
  new Date("2025-06-01T20:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  10,
  100,
  "PTY",
  "SJO",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

graph.addAirportFlightConnection(
  11,
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
  100,
  "MEX",
  "SJO",
  new Date("2025-06-01T12:00:00Z"),
  new Date("2025-06-01T14:00:00Z"),
  120
);

graph.addAirportFlightConnection(
  13,
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
  100,
  "MDE",
  "BOG",
  new Date("2025-06-01T12:00:00Z"),
  new Date("2025-06-01T14:00:00Z"),
  120
);

const result = graph.tripSelection();
if (result) {
  const { itinerary, passengerQty } = result;
  console.log(itinerary);
}
*/
