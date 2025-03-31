import { Flight, City } from "./index";

export class Airport {
  airportId: string;
  city: City;
  flights: Flight[];

  constructor(airportId: string, city: City) {
    this.airportId = airportId;
    this.city = city;
    this.flights = [];
  }
}
