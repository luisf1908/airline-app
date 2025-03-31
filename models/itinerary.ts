import { Flight } from "./index";

export class Itinerary {
  oneWayTrip: Flight[];
  returnTrip: Flight[];

  constructor() {
    this.oneWayTrip = [];
    this.returnTrip = [];
  }
}
