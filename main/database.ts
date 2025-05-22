import {
  AirlineApp,
  Airplane,
  Airport,
  AirportGraph,
  FlightReservation,
  Passenger,
  Country,
  State,
  City,
} from "../models/index";

//Creation of the app instance
export const airlineApplication = new AirlineApp();

//Country database
const country1 = new Country("Costa Rica");
const country2 = new Country("Panama");
const country3 = new Country("Colombia");
const country4 = new Country("Mexico");

//States database
const state1 = new State("San Jose", country1);
const state2 = new State("Chiriqui", country2);
const state3 = new State("Antioquia", country3);
const state4 = new State("Bogotá", country3);
const state5 = new State("Mexico DF", country4);

//City database
const city1 = new City("San Jose", state1);
const city2 = new City("Panama City", state2);
const city3 = new City("Medellin", state3);
const city4 = new City("Bogotá", state4);
const city5 = new City("Mexico DF", state4);

//Airport database
airlineApplication.airportGraph.addAirport("SJO", city1, 20);
airlineApplication.airportGraph.addAirport("PTY", city2, 20);
airlineApplication.airportGraph.addAirport("MDE", city3, 20);
airlineApplication.airportGraph.addAirport("BOG", city4, 20);
airlineApplication.airportGraph.addAirport("MEX", city5, 20);

//Flights database
//San Jose Flights
airlineApplication.airportGraph.addAirportFlightConnection(
  1,
  100,
  "SJO",
  "BOG",
  new Date("2025-06-01T06:00:00Z"),
  new Date("2025-06-01T08:00:00Z"),
  120
);

airlineApplication.airportGraph.addAirportFlightConnection(
  2,
  100,
  "SJO",
  "BOG",
  new Date("2025-06-01T09:00:00Z"),
  new Date("2025-06-01T11:00:00Z"),
  120
);

airlineApplication.airportGraph.addAirportFlightConnection(
  3,
  100,
  "SJO",
  "MDE",
  new Date("2025-06-01T07:00:00Z"),
  new Date("2025-06-01T09:00:00Z"),
  120
);

airlineApplication.airportGraph.addAirportFlightConnection(
  4,
  100,
  "SJO",
  "MEX",
  new Date("2025-06-01T07:00:00Z"),
  new Date("2025-06-01T09:00:00Z"),
  120
);

airlineApplication.airportGraph.addAirportFlightConnection(
  5,
  100,
  "SJO",
  "PTY",
  new Date("2025-06-01T04:30:00Z"),
  new Date("2025-06-01T05:00:00Z"),
  120
);

//Bogota Flights

airlineApplication.airportGraph.addAirportFlightConnection(
  6,
  100,
  "BOG",
  "MDE",
  new Date("2025-06-01T19:00:00Z"),
  new Date("2025-06-01T20:00:00Z"),
  120
);

airlineApplication.airportGraph.addAirportFlightConnection(
  7,
  100,
  "BOG",
  "MDE",
  new Date("2025-06-01T17:00:00Z"),
  new Date("2025-06-01T18:00:00Z"),
  120
);

airlineApplication.airportGraph.addAirportFlightConnection(
  8,
  100,
  "BOG",
  "SJO",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

//Panama Flights

airlineApplication.airportGraph.addAirportFlightConnection(
  9,
  100,
  "PTY",
  "MDE",
  new Date("2025-06-01T18:00:00Z"),
  new Date("2025-06-01T20:00:00Z"),
  120
);

airlineApplication.airportGraph.addAirportFlightConnection(
  10,
  100,
  "PTY",
  "SJO",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

airlineApplication.airportGraph.addAirportFlightConnection(
  11,
  100,
  "PTY",
  "BOG",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

//Mexico Flights

airlineApplication.airportGraph.addAirportFlightConnection(
  12,
  100,
  "MEX",
  "SJO",
  new Date("2025-06-01T12:00:00Z"),
  new Date("2025-06-01T14:00:00Z"),
  120
);

airlineApplication.airportGraph.addAirportFlightConnection(
  13,
  100,
  "MEX",
  "PTY",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

//Medellin Flights

airlineApplication.airportGraph.addAirportFlightConnection(
  14,
  100,
  "MDE",
  "BOG",
  new Date("2025-06-01T12:00:00Z"),
  new Date("2025-06-01T14:00:00Z"),
  120
);
