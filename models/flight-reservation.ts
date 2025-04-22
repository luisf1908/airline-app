import {
  Flight,
  Itinerary,
  Passenger,
  Airplane,
  Airport,
  City,
  Country,
  State,
} from "./index";
import { Baggage } from "../types";
import promptSync from "prompt-sync";
const prompt = promptSync();

export class FlightReservation {
  reservationCode: string;
  passengers: Passenger[];
  baggage: Baggage[][]; // Matrix where rows represent trips (outbound and return) and columns represents passengers
  seat: string[][]; // Matrix where rows represent flights and columns represents passengers
  itinerary!: Itinerary;
  cost: number;

  constructor() {
    this.reservationCode = "";
    this.passengers = [];
    this.baggage = [];
    this.seat = [];
    this.cost = 0;
  }

  private generateReservationCode(): string {
    const CODE_LENGTH: number = 6;
    const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let reservationCode: string = "";

    for (let i = 0; i < CODE_LENGTH; i++) {
      reservationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return reservationCode;
  }

  private getPassengersInformation(passengerQty: number): void {
    for (let i = 1; i <= passengerQty; i++) {
      if (i === 1) {
        console.log(`Passenger ${i} (Reservation Holder)`);
      } else {
        console.log(`Passenger ${i}`);
      }
      const firstName = prompt("First name: ");
      const lastName = prompt("Last name: ");
      const email = prompt("Email: ");
      const passportId = prompt("Passport ID: ");
      console.log(`\n`);

      this.passengers.push(
        new Passenger(firstName, lastName, email, passportId)
      );
    }
  }

  private generateDefaultBaggageMatrix(): void {
    let tripsQty: number = 0;
    if (this.itinerary.returnTrip.length > 0) {
      tripsQty = 2;
    } else {
      tripsQty = 1;
    }
    this.baggage = Array.from({ length: tripsQty }, () =>
      Array.from({ length: this.passengers.length }, () => ({
        personalItem: 1,
        carryOn: 0,
        checked: 0,
      }))
    );
  }
  private addBaggageForEachPassenger(): void {
    this.generateDefaultBaggageMatrix();
    if (this.baggage.length === 0) {
      throw new Error("Baggage and seat matrix is empty");
      return;
    }
    const [outboundTripOriginAirport, outboundTripDestinationAirport] =
      this.itinerary.getOriginAndDestinationAirportOfTrip(
        this.itinerary.outboundTrip
      );
    const [returnTripOriginAirport, returnTripDestinationAirport] =
      this.itinerary.getOriginAndDestinationAirportOfTrip(
        this.itinerary.returnTrip
      );

    let tripsQty: number = 0;
    if (this.itinerary.returnTrip.length > 0) {
      tripsQty = 2;
    } else {
      tripsQty = 1;
    }
    for (let i = 0; i < tripsQty; i++) {
      if (i === 0) {
        console.log(
          `Flight from ${outboundTripOriginAirport?.airportId} to ${outboundTripDestinationAirport?.airportId}`
        );
      } else {
        console.log(
          `Flight from ${returnTripOriginAirport?.airportId} to ${returnTripDestinationAirport?.airportId}`
        );
      }

      for (let j = 0; j < this.passengers.length; j++) {
        console.log(
          `Want to add baggage for ${this.passengers[j].firstName} ${this.passengers[j].lastName}?\n1. Yes\n2. Skip to next passenger`
        );
        const userChoice1 = Number(prompt(""));
        if (userChoice1 === 1) {
          this.addBaggage(i, j);
        }
      }
    }
  }
  private addBaggage(flightIndex: number, passengerIndex: number): void {
    let addAnotherBaggage: boolean = true;
    const baggage: Baggage = {
      personalItem: 1,
      carryOn: 0,
      checked: 0,
    };
    while (addAnotherBaggage) {
      console.log("1. Carry On\n2. Checked");
      const baggageType = Number(
        prompt("Choose the baggage you want to add: ")
      );
      const baggageQty = Number(prompt("Quantity (MAX: 5): "));

      if (
        (baggageType != 1 && baggageType != 2) ||
        baggageQty < 0 ||
        baggageQty > 5
      ) {
        console.log("Invalid choice or quantity");
      } else if (baggageType === 1 && baggageQty >= 0 && baggageQty <= 5) {
        baggage.carryOn = baggageQty;
      } else if (baggageType === 2 && baggageQty >= 0 && baggageQty <= 5) {
        baggage.checked = baggageQty;
      }

      console.log("Press:\n1. Add more baggage\n2. Exit baggage menu");
      const userChoice = Number(prompt(""));
      if (userChoice === 2) {
        addAnotherBaggage = false;
        this.baggage[flightIndex][passengerIndex] = baggage;
      }
    }
  }

  private generateDefaultSeatMatrix(): void {
    let totalFlightsQty: number =
      this.itinerary.outboundTrip.length + this.itinerary.returnTrip.length;

    this.seat = Array.from({ length: totalFlightsQty }, () =>
      Array.from({ length: this.passengers.length }, () => "")
    );
  }
  private reserveSeatForEachPassenger(): void {
    this.generateDefaultSeatMatrix();
    const totalReservationFlights: Flight[] =
      this.itinerary.outboundTrip.concat(this.itinerary.returnTrip);
    for (let i = 0; i < totalReservationFlights.length; i++) {
      console.log(
        `Flight from ${totalReservationFlights[i].origin.airportId} to ${totalReservationFlights[i].destination.airportId}`
      );
      for (let j = 0; j < this.passengers.length; j++) {
        console.log(
          `Want to reserve a seat for ${this.passengers[j].firstName} ${this.passengers[j].lastName}?\n1. Yes\n2. Skip to next passenger`
        );
        const userChoice1 = Number(prompt(""));
        if (userChoice1 === 1) {
          totalReservationFlights[i].airplane.displaySeats();
          console.log("Type the row and seat you want to reserve");
          const row = Number(prompt("Row: "));
          const seat = prompt("Seat letter: ");
          totalReservationFlights[i].airplane.reserveSeat(row, seat);
          totalReservationFlights[i].airplane.displaySeats();
          this.seat[i][j] = `${row}${seat.toUpperCase()}`;
        }
      }
    }
  }

  createReservation(
    itinerary: Itinerary,
    passengerQty: number
  ): FlightReservation | null {
    this.itinerary = itinerary;

    //Passenger Information
    console.log("************************************************");
    console.log("Passenger Information\n");
    this.getPassengersInformation(passengerQty);
    console.log("************************************************");

    //Baggage selection
    console.log("************************************************");
    console.log(
      "1. Add baggage\nType any other character to skip to seat selection"
    );
    const userChoice1 = Number(prompt(""));
    if (userChoice1 === 1) {
      console.log("************************************************");
      console.log("Baggage Selection");
      this.addBaggageForEachPassenger();
      console.log("************************************************");
    }

    //Seat selection
    console.log("************************************************");
    console.log(
      "1. Select seats\nType any other character to skip to confirm reservation"
    );
    const userChoice2 = Number(prompt(""));
    if (userChoice2 === 1) {
      console.log("************************************************");
      console.log("Seat Selection");
      this.reserveSeatForEachPassenger();
      console.log("************************************************");
    }

    //Confirm reservation
    console.log("************************************************");
    console.log("Reservation summary\n");
    console.log("Outbound Trip");
    this.itinerary.displayTripInformation(this.itinerary.outboundTrip);

    if (this.itinerary.returnTrip.length > 0) {
      console.log(`\n\nReturn Trip`);
      this.itinerary.displayTripInformation(this.itinerary.returnTrip);
    }

    console.log("************************************************");
    console.log(`Total cost: $${this.cost}\n`);

    console.log("************************************************");
    console.log(
      "1. Confirm reservation\nType any other character to cancel reservation"
    );
    const userChoice3 = Number(prompt(""));
    if (userChoice3 === 1) {
      this.reservationCode = this.generateReservationCode();
      console.log(`Congratulations, your reservation has been confirmed`);
      console.log(`Reservation code: ${this.reservationCode}`);
      return this;
    } else {
      return null;
    }
  }
}

const p1 = new Passenger("Luis", "Murillo", "luisf1908@gmail.com", "116150349");
const p2 = new Passenger(
  "Martha",
  "Espinoza",
  "luisf1908@gmail.com",
  "116150349"
);

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
  new Date("2025-04-25T09:25:00Z"),
  new Date("2025-04-25T10:30:00Z"),
  120
);
const flight2 = new Flight(
  924,
  airplane2,
  100,
  airport2,
  airport3,
  new Date("2025-04-25T11:48:00Z"),
  new Date("2025-04-25T13:05:00Z"),
  120
);
const flight3 = new Flight(
  545,
  airplane3,
  100,
  airport3,
  airport1,
  new Date("2025-04-30T09:07:00Z"),
  new Date("2025-04-30T11:14:00Z"),
  120
);

const r1 = new FlightReservation();

const i1 = new Itinerary();

i1.outboundTrip.push(flight1, flight2);
i1.returnTrip.push(flight3);

r1.createReservation(i1, 2);

console.log(r1.reservationCode);
console.log(r1.passengers);
console.log(r1.baggage);
console.log(r1.seat);
console.log(r1.itinerary);*/
