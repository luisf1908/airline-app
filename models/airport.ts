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
