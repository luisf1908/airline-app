import {
  Flight,
  Itinerary,
  Passenger,
  Airplane,
  Airport,
  City,
  Country,
  State,
  FlightTicket,
} from "./index";
import { Baggage } from "../types";
import promptSync from "prompt-sync";
const prompt = promptSync();

export class FlightReservation {
  CARRY_ON_PRICE: number = 40;
  CHECKED_BAG_PRICE: number = 50;

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
        console.log(`//  Passenger ${i} (Reservation Holder)  //`);
      } else {
        console.log(`//  Passenger ${i}  //  `);
      }
      const firstName = prompt("First name: ");
      const lastName = prompt("Last name: ");
      const email = prompt("Email: ");
      const passportId = prompt("Passport ID: ");

      this.passengers.push(
        new Passenger(firstName, lastName, email, passportId)
      );
      console.log(`\n`);
    }
  }
  private displayPassengersInfo(): void {
    console.log(`//  Passengers information  //\n`);
    for (let i = 0; i < this.passengers.length; i++) {
      if (i === 0) {
        console.log(`* Passenger ${i + 1} (Reservation Holder) *`);
      } else {
        console.log(`* Passenger ${i + 1} *`);
      }
      console.log(`First name: ${this.passengers[i].firstName}`);
      console.log(`Last name: ${this.passengers[i].lastName}`);
      console.log(`Email: ${this.passengers[i].email}`);
      console.log(`Passport ID: ${this.passengers[i].passportId}`);
      console.log("\n\n");
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
          `//  Flight from ${outboundTripOriginAirport?.city.name} to ${outboundTripDestinationAirport?.city.name}  //`
        );
      } else {
        console.log(
          `//  Flight from ${returnTripOriginAirport?.city.name} to ${returnTripDestinationAirport?.city.name}  //`
        );
      }

      for (let j = 0; j < this.passengers.length; j++) {
        console.log(
          `Want to add baggage for ${this.passengers[j].firstName} ${this.passengers[j].lastName}?\n1. Yes\n2. Skip to next passenger`
        );
        const userChoice1 = Number(prompt("Choose option: "));

        if (
          !userChoice1 ||
          isNaN(userChoice1) ||
          userChoice1 < 1 ||
          userChoice1 > 2
        ) {
          console.log("\nInvalid option\n");
          return;
        }
        if (userChoice1 === 1) {
          this.addBaggage(i, j);
        }
        console.log("\n");
      }
      console.log("\n");
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
      console.log(`\nBaggage types`);
      console.log(
        `1. Carry On ($${this.CARRY_ON_PRICE})\n2. Checked ($${this.CHECKED_BAG_PRICE})`
      );
      const baggageType = Number(
        prompt("Choose the baggage you want to add: ")
      );
      const baggageQty = Number(prompt("Quantity (MAX: 5): "));

      if (
        (baggageType != 1 && baggageType != 2) ||
        baggageQty < 0 ||
        baggageQty > 5
      ) {
        console.log("\nInvalid choice or quantity");
      } else if (baggageType === 1 && baggageQty >= 0 && baggageQty <= 5) {
        baggage.carryOn = baggageQty;
      } else if (baggageType === 2 && baggageQty >= 0 && baggageQty <= 5) {
        baggage.checked = baggageQty;
      }

      console.log("\nWant to: \n1. Add more baggage\n2. Exit baggage menu");
      const userChoice = Number(prompt("Choose option: "));
      if (userChoice === 2) {
        addAnotherBaggage = false;
        this.baggage[flightIndex][passengerIndex] = baggage;
      }
    }
  }
  private displayBaggageInfo(): void {
    console.log(`//  Baggage information  //\n`);
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
          `* Flight from ${outboundTripOriginAirport?.city.name} to ${outboundTripDestinationAirport?.city.name} *`
        );
      } else {
        console.log(
          `* Flight from ${returnTripOriginAirport?.city.name} to ${returnTripDestinationAirport?.city.name} *`
        );
      }

      for (let j = 0; j < this.passengers.length; j++) {
        console.log(
          ` Baggage for ${this.passengers[j].firstName} ${this.passengers[j].lastName}:`
        );
        console.log(`   Carry On: ${this.baggage[i][j].carryOn}`);
        console.log(`   Checked: ${this.baggage[i][j].checked}`);
      }
      console.log("\n");
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
    const totalReservationFlights: Flight[] =
      this.itinerary.outboundTrip.concat(this.itinerary.returnTrip);
    for (let i = 0; i < totalReservationFlights.length; i++) {
      console.log(
        `\n//  Flight from ${totalReservationFlights[i].origin.city.name} to ${totalReservationFlights[i].destination.city.name}  //`
      );
      for (let j = 0; j < this.passengers.length; j++) {
        console.log(
          `Want to reserve a seat for ${this.passengers[j].firstName} ${this.passengers[j].lastName}?\n1. Yes\n2. Skip to next passenger`
        );
        const userChoice1 = Number(prompt("Choose option: "));

        if (
          !userChoice1 ||
          isNaN(userChoice1) ||
          userChoice1 < 1 ||
          userChoice1 > 2
        ) {
          console.log("\nInvalid option\n");
          return;
        }

        if (userChoice1 === 1) {
          console.log(`\nBlueHorizon Airplane`);
          totalReservationFlights[i].airplane.displaySeats();
          console.log("\nChoose the row and seat you want to reserve");
          const row = Number(prompt("Row: "));
          const seat = prompt("Seat letter: ");

          //Error handling
          if (
            !row ||
            isNaN(row) ||
            row < 1 ||
            row > totalReservationFlights[i].airplane.rows
          ) {
            console.log("\nInvalid row");
            continue;
          }

          const allowedSeats: string[] = ["A", "B", "C", "D", "E", "F"];
          if (!seat || !allowedSeats.includes(seat.toUpperCase())) {
            console.log("\nInvalid seat");
            continue;
          }

          totalReservationFlights[i].airplane.reserveSeat(row, seat);
          console.log(`\nSeat ${row}${seat.toUpperCase()} has been reserved`);
          totalReservationFlights[i].airplane.displaySeats();
          console.log("\n");
          this.seat[i][j] = `${row}${seat.toUpperCase()}`;
        }
        console.log("\n");
      }
    }
  }
  private clearReservationSeats(): void {
    const totalReservationFlights: Flight[] =
      this.itinerary.outboundTrip.concat(this.itinerary.returnTrip);
    for (let i = 0; i < totalReservationFlights.length; i++) {
      for (let j = 0; j < this.passengers.length; j++) {
        const row = Number(this.seat[i][j].slice(-3, -1));
        const seat = this.seat[i][j].slice(-1);

        if (row === 0 && seat === "") {
          return;
        }

        totalReservationFlights[i].airplane.clearSeat(row, seat);
      }
    }
  }
  private displaySeatInfo(): void {
    console.log(`//  Seats information  //\n`);
    const totalReservationFlights: Flight[] =
      this.itinerary.outboundTrip.concat(this.itinerary.returnTrip);
    for (let i = 0; i < totalReservationFlights.length; i++) {
      console.log(
        `* Flight from ${totalReservationFlights[i].origin.city.name} to ${totalReservationFlights[i].destination.city.name} *`
      );
      for (let j = 0; j < this.passengers.length; j++) {
        console.log(
          ` Seat for ${this.passengers[j].firstName} ${this.passengers[j].lastName}: ${this.seat[i][j]}`
        );
      }
      console.log("\n");
    }
    console.log("\n\n");
  }
  private assignRandomSeat(flight: Flight): string | undefined {
    const totalReservationFlights: Flight[] =
      this.itinerary.outboundTrip.concat(this.itinerary.returnTrip);

    const airplaneSeatsAvailable: string[] =
      flight.airplane.getAvailableSeats();

    const randomSeat = airplaneSeatsAvailable.pop();

    if (!randomSeat) {
      return;
    }
    return randomSeat;
  }

  private calculateTotalTripCost(): void {
    const flightsCost: number = this.itinerary.cost * this.passengers.length;

    const baggageCost = this.baggage.reduce(
      (totalCost, currentTripBaggages) => {
        return (
          totalCost +
          currentTripBaggages.reduce(
            (totalTripBaggageCost, currentPassengerBaggage) => {
              return (
                totalTripBaggageCost +
                currentPassengerBaggage.carryOn * this.CARRY_ON_PRICE +
                currentPassengerBaggage.checked * this.CHECKED_BAG_PRICE
              );
            },
            0
          )
        );
      },
      0
    );

    this.cost = flightsCost + baggageCost;
  }

  private displayItineraryInfo(): void {
    console.log(`//  Itinerary  //\n`);
    console.log("Outbound Trip");
    this.itinerary.displayTripInformation(this.itinerary.outboundTrip);

    if (this.itinerary.returnTrip.length > 0) {
      console.log(`\n\nReturn Trip`);
      this.itinerary.displayTripInformation(this.itinerary.returnTrip);
    }

    this.calculateTotalTripCost();

    console.log("\n\n************************************************");
    console.log(`Total cost: $${this.cost}`);
    console.log("************************************************\n\n");
  }

  private generateFlightTickets(): void {
    const totalReservationFlights: Flight[] =
      this.itinerary.outboundTrip.concat(this.itinerary.returnTrip);
    for (let i = 0; i < totalReservationFlights.length; i++) {
      totalReservationFlights[i].removeReservationTickets(this.reservationCode);
      for (let j = 0; j < this.passengers.length; j++) {
        const flightTicket = new FlightTicket(
          this,
          totalReservationFlights[i],
          this.passengers[j],
          this.seat[i][j]
        );
        totalReservationFlights[i].tickets.push(flightTicket);
      }
    }
  }

  checkIn(): void {
    console.log(
      "************************  CHECK-IN ONLINE  ************************\n"
    );

    const totalReservationFlights: Flight[] =
      this.itinerary.outboundTrip.concat(this.itinerary.returnTrip);

    console.log("Select the flight you want to check-in: \n");
    for (let i = 1; i <= totalReservationFlights.length; i++) {
      console.log(
        `${i}. ${totalReservationFlights[i - 1].origin.city.name} to ${
          totalReservationFlights[i - 1].destination.city.name
        }`
      );
    }
    console.log("\n");
    const userChoice1 = Number(prompt(`Choose an option: `));
    console.log("\n");

    if (
      !userChoice1 ||
      isNaN(userChoice1) ||
      userChoice1 < 1 ||
      userChoice1 > totalReservationFlights.length
    ) {
      console.log("Invalid option");
      return;
    }

    console.log("Select the passenger you want to check-in: \n");
    for (let i = 1; i <= this.passengers.length; i++) {
      console.log(
        `${i}. ${this.passengers[i - 1].firstName} ${
          this.passengers[i - 1].lastName
        }`
      );
    }
    console.log("\n");
    const userChoice2 = Number(prompt(`Choose an option: `));
    console.log("\n");

    if (
      !userChoice2 ||
      isNaN(userChoice2) ||
      userChoice2 < 1 ||
      userChoice2 > this.passengers.length
    ) {
      console.log("Invalid option");
      return;
    }

    const flightIndex: number = userChoice1 - 1;
    const passengerIndex: number = userChoice2 - 1;

    const flightTicket = totalReservationFlights[flightIndex].getTicket(
      this.passengers[passengerIndex]
    );
    if (!flightTicket) {
      return;
    }
    if (this.seat[flightIndex][passengerIndex] === "") {
      const randomSeat = this.assignRandomSeat(
        totalReservationFlights[flightIndex]
      );
      if (randomSeat) {
        this.seat[flightIndex][passengerIndex] = randomSeat;
        flightTicket.seat = randomSeat;
      }
    }

    flightTicket.printBoardingPass();
    flightTicket.isCheckedIn = true;
    console.log("\n");

    const userChoice3 = Number(
      prompt("Type any character to return to main menu: ")
    );
    console.log("\n");
  }

  createReservation(
    itinerary: Itinerary,
    passengerQty: number
  ): FlightReservation | undefined {
    this.itinerary = itinerary;

    //Passenger Information
    console.log(
      "\n************************  PASSENGER INFORMATION  ************************"
    );
    console.log("\n");
    this.getPassengersInformation(passengerQty);
    console.log("\n");

    //Baggage selection
    console.log(
      "************************  BAGGAGE SELECTION  ************************"
    );

    this.generateDefaultBaggageMatrix();

    const userChoice1 = Number(
      prompt(
        "Type 1 to add baggage, or type any other character to skip to seat selection: "
      )
    );
    console.log("\n");

    if (userChoice1 === 1) {
      this.addBaggageForEachPassenger();
    }

    //Seat selection
    console.log(
      "************************  SEAT SELECTION  ************************"
    );

    this.generateDefaultSeatMatrix();

    const userChoice2 = Number(
      prompt(
        "Type 1 to select seats, or type any other character to skip to confirm reservation: "
      )
    );
    if (userChoice2 === 1) {
      this.reserveSeatForEachPassenger();
      console.log("\n");
    }

    //Confirm reservation
    console.log(
      "\n************************  RESERVATION SUMMARY  ************************"
    );
    this.displayItineraryInfo();
    const userChoice3 = Number(
      prompt(
        "Type 1 to confirm reservation, or type any other character to cancel reservation: "
      )
    );
    if (userChoice3 === 1) {
      this.reservationCode = this.generateReservationCode();
      console.log(`\nCongratulations, your reservation has been confirmed!!`);
      console.log(`Reservation code: ${this.reservationCode}`);
      this.generateFlightTickets();
      return this;
    } else {
      console.log(`\nYour reservation has been cancelled`);
      this.clearReservationSeats();
      return;
    }
  }

  private editReservation(): void {
    console.log(
      "************************  EDIT RESERVATION  ************************\n"
    );

    while (true) {
      console.log(
        "1. Edit passengers information\n2. Edit baggage selection\n3. Edit seat selection\n4. Exit\n"
      );
      const userChoice = Number(prompt("Choose an option: "));

      console.log("\n");

      if (
        userChoice < 1 ||
        userChoice > 3 ||
        !userChoice ||
        isNaN(userChoice)
      ) {
        return;
      }

      if (userChoice === 1) {
        const passengerQty: number = this.passengers.length;
        this.passengers = [];
        console.log(
          "\n************************  PASSENGER INFORMATION  ************************"
        );
        console.log("\n");
        this.getPassengersInformation(passengerQty);
        console.log("\nPassengers information has been modified\n");
      }

      if (userChoice === 2) {
        console.log(
          "************************  BAGGAGE SELECTION  ************************"
        );

        this.addBaggageForEachPassenger();
        console.log("\nBaggage selection has been modified\n");
      }

      if (userChoice === 3) {
        console.log(
          "************************  SEAT SELECTION  ************************"
        );
        this.clearReservationSeats();
        this.reserveSeatForEachPassenger();
        console.log("\nSeat selection has been modified\n");
      }
    }
  }

  displayCompleteReservationInfo(): void {
    while (true) {
      console.log(
        "************************  RESERVATION INFORMATION  ************************\n"
      );
      console.log(`Reservation code: ${this.reservationCode}\n`);
      this.displayItineraryInfo();
      this.displayPassengersInfo();
      this.displayBaggageInfo();
      this.displaySeatInfo();

      console.log("\n");

      const userChoice1 = Number(
        prompt(
          "Type 1 to edit your reservation, or type any other character to exit to main menu: "
        )
      );
      console.log("\n");

      if (userChoice1 === 1) {
        this.editReservation();
        this.generateFlightTickets();
        console.log("\n");
      } else {
        return;
      }
    }
  }
}

/*
//Test Code
const p1 = new Passenger("Luis", "Murillo", "luisf1908@gmail.com", "116150349");
const p2 = new Passenger(
  "Martha",
  "Espinoza",
  "luisf1908@gmail.com",
  "116150349"
);

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

const airport1 = new Airport("SJO", city1, 20);
const airport2 = new Airport("PNA", city2, 20);
const airport3 = new Airport("MDE", city3, 20);

const airplane1 = new Airplane("A579", 12);
const airplane2 = new Airplane("A684", 12);
const airplane3 = new Airplane("A987", 12);

const flight1 = new Flight(
  876,
  100,
  airport1,
  airport2,
  new Date("2025-04-25T09:25:00Z"),
  new Date("2025-04-25T10:30:00Z"),
  120
);
const flight2 = new Flight(
  924,
  100,
  airport2,
  airport3,
  new Date("2025-04-25T11:48:00Z"),
  new Date("2025-04-25T13:05:00Z"),
  120
);
const flight3 = new Flight(
  545,
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
//i1.returnTrip.push(flight3);

r1.createReservation(i1, 2);
console.log(r1.itinerary.outboundTrip[0].tickets);
console.log(r1.itinerary.outboundTrip[1].tickets);
r1.displayCompleteReservationInfo();
r1.checkIn();
*/
