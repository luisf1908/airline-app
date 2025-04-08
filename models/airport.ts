import { Flight, City, Airplane } from "./index";

export class Airport {
  airportId: string;
  city: City;
  flights: Flight[];

  constructor(airportId: string, city: City) {
    this.airportId = airportId;
    this.city = city;
    this.flights = [];
  }

  addflight(flightNumber: number, cost: number, airplane: Ai);
}

/*export class AirportGraph {
  airports: Map<string, Airport>;

  constructor() {
    this.airports = new Map();
  }

  addAirport(id: string, city: City): void {
    this.airports.set(id, new Airport(id, city));
  }

  getAirport(id: string): Airport | undefined {
    return this.airports.get(id);
  }

  addFlight(fromId: string, toId: string): void {}
}*/
