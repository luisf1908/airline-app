import { Itinerary, Passenger } from "./index";
import { Baggage } from "../types";

export class FlightReservation {
  reservationCode: string;
  passengers: Passenger[];
  cost: number;
  baggage: Baggage;
  itinerary: Itinerary;

  constructor() {
    this.reservationCode = "";
    this.passengers = [];
    this.cost = 0;
    this.baggage = {
      personalItem: 0,
      carryOn: 0,
      checked: 0,
    };
    this.itinerary = {
      oneWayTrip: [],
      returnTrip: [],
    };
  }
}
