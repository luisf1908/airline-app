import {
  Airplane,
  Airport,
  AirportGraph,
  FlightReservation,
  Passenger,
  Country,
  State,
  City,
} from "./index";
import promptSync from "prompt-sync";
const prompt = promptSync();

export class AirlineApp {
  airportGraph: AirportGraph;
  reservations: Map<string, FlightReservation>;

  constructor() {
    this.airportGraph = new AirportGraph();
    this.reservations = new Map<string, FlightReservation>();
  }

  isReservationInfoValid(reservationCode: string, lastName: string): boolean {
    if (!this.reservations.has(reservationCode)) {
      return false;
    }

    if (
      this.reservations.get(reservationCode)?.passengers[0].lastName !==
      lastName
    ) {
      return false;
    }

    return true;
  }

  makeFlightReservation(): void {
    console.log(
      "************************  SEARCH FLIGHT  ************************\n"
    );
    const temp = this.airportGraph.tripSelection();

    if (!temp) {
      return;
    }

    const { itinerary, passengerQty } = temp;

    if (!itinerary || !passengerQty) {
      return;
    }

    const flightReservation = new FlightReservation();

    const createdFlightReservation = flightReservation.createReservation(
      itinerary,
      passengerQty
    );

    if (!createdFlightReservation) {
      return;
    }

    this.reservations.set(
      createdFlightReservation.reservationCode,
      createdFlightReservation
    );

    return;
  }

  checkFlightReservation(): void {
    console.log(
      "************************  CHECK FLIGHT RESERVATION  ************************\n"
    );

    const reservationCode: string = prompt(
      "Enter the reservation code: "
    ).toUpperCase();

    const lastName: string = prompt(
      "Enter the reservation's holder last name: "
    );

    if (!this.isReservationInfoValid(reservationCode, lastName)) {
      console.log("\nReservation not found");
      return;
    }

    const flightReservation = this.reservations.get(reservationCode);

    if (!flightReservation) {
      return;
    }

    console.log("\n");
    flightReservation.displayCompleteReservationInfo();
  }

  checkIn(): void {
    console.log(
      "************************  CHECK-IN  ************************\n"
    );

    const reservationCode: string = prompt(
      "Enter the reservation code: "
    ).toUpperCase();

    const lastName: string = prompt(
      "Enter the reservation's holder last name: "
    );

    if (!this.isReservationInfoValid(reservationCode, lastName)) {
      console.log("\nReservation not found");
      return;
    }
    const flightReservation = this.reservations.get(reservationCode);

    if (!flightReservation) {
      return;
    }

    console.log("\n");
    flightReservation.checkIn();
  }

  initiateProgram(): void {
    console.log("Welcome to BlueHorizon Airways\n");
    console.log("The best fares to your next horizon\n");

    while (true) {
      console.log(
        "\n************************  MAIN MENU  ************************\n"
      );
      console.log("1. Search flights");
      console.log("2. Check flight reservation");
      console.log("3. Check-in");
      console.log("4. Exit\n");

      const mainMenuChoice = Number(prompt("Choose an option: "));

      console.log("\n");

      if (
        !mainMenuChoice ||
        isNaN(mainMenuChoice) ||
        mainMenuChoice < 1 ||
        mainMenuChoice > 4
      ) {
        console.log("Invalid option. Try again.");
      }

      if (mainMenuChoice === 4) {
        return;
      }

      if (mainMenuChoice === 1) {
        this.makeFlightReservation();
      }

      if (mainMenuChoice === 2) {
        this.checkFlightReservation();
      }

      if (mainMenuChoice === 3) {
        this.checkIn();
      }
    }
  }
}

//Test Code

const country1 = new Country("Costa Rica");
const country2 = new Country("Panama");
const country3 = new Country("Colombia");
const country4 = new Country("Mexico");

const state1 = new State("San Jose", country1);
const state2 = new State("Chiriqui", country2);
const state3 = new State("Antioquia", country3);
const state4 = new State("Bogotá", country3);
const state5 = new State("Mexico DF", country4);

const city1 = new City("San Jose", state1);
const city2 = new City("Panama City", state2);
const city3 = new City("Medellin", state3);
const city4 = new City("Bogotá", state4);
const city5 = new City("Mexico DF", state4);

const airplane1 = new Airplane("A579", 12);
const airplane2 = new Airplane("A684", 12);
const airplane3 = new Airplane("A987", 12);

const app = new AirlineApp();

app.airportGraph.addAirport("SJO", city1, 20);
app.airportGraph.addAirport("PTY", city2, 20);
app.airportGraph.addAirport("MDE", city3, 20);
app.airportGraph.addAirport("BOG", city4, 20);
app.airportGraph.addAirport("MEX", city5, 20);

//San Jose Flights
app.airportGraph.addAirportFlightConnection(
  1,
  100,
  "SJO",
  "BOG",
  new Date("2025-06-01T06:00:00Z"),
  new Date("2025-06-01T08:00:00Z"),
  120
);

app.airportGraph.addAirportFlightConnection(
  2,
  100,
  "SJO",
  "BOG",
  new Date("2025-06-01T09:00:00Z"),
  new Date("2025-06-01T11:00:00Z"),
  120
);

app.airportGraph.addAirportFlightConnection(
  3,
  100,
  "SJO",
  "MDE",
  new Date("2025-06-01T07:00:00Z"),
  new Date("2025-06-01T09:00:00Z"),
  120
);

app.airportGraph.addAirportFlightConnection(
  4,
  100,
  "SJO",
  "MEX",
  new Date("2025-06-01T07:00:00Z"),
  new Date("2025-06-01T09:00:00Z"),
  120
);

app.airportGraph.addAirportFlightConnection(
  5,
  100,
  "SJO",
  "PTY",
  new Date("2025-06-01T04:30:00Z"),
  new Date("2025-06-01T05:00:00Z"),
  120
);

//Bogota Flights

app.airportGraph.addAirportFlightConnection(
  6,
  100,
  "BOG",
  "MDE",
  new Date("2025-06-01T19:00:00Z"),
  new Date("2025-06-01T20:00:00Z"),
  120
);

app.airportGraph.addAirportFlightConnection(
  7,
  100,
  "BOG",
  "MDE",
  new Date("2025-06-01T17:00:00Z"),
  new Date("2025-06-01T18:00:00Z"),
  120
);

app.airportGraph.addAirportFlightConnection(
  8,
  100,
  "BOG",
  "SJO",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

//Panama Flights

app.airportGraph.addAirportFlightConnection(
  9,
  100,
  "PTY",
  "MDE",
  new Date("2025-06-01T18:00:00Z"),
  new Date("2025-06-01T20:00:00Z"),
  120
);

app.airportGraph.addAirportFlightConnection(
  10,
  100,
  "PTY",
  "SJO",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

app.airportGraph.addAirportFlightConnection(
  11,
  100,
  "PTY",
  "BOG",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

//Mexico Flights

app.airportGraph.addAirportFlightConnection(
  12,
  100,
  "MEX",
  "SJO",
  new Date("2025-06-01T12:00:00Z"),
  new Date("2025-06-01T14:00:00Z"),
  120
);

app.airportGraph.addAirportFlightConnection(
  13,
  100,
  "MEX",
  "PTY",
  new Date("2025-06-01T13:30:00Z"),
  new Date("2025-06-01T15:30:00Z"),
  120
);

//Medellin Flights

app.airportGraph.addAirportFlightConnection(
  14,
  100,
  "MDE",
  "BOG",
  new Date("2025-06-01T12:00:00Z"),
  new Date("2025-06-01T14:00:00Z"),
  120
);

app.initiateProgram();
