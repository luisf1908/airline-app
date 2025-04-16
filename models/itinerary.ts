import { Flight, Airport, Airplane, Country, State, City } from "./index";

export class Itinerary {
  outboundTrip: Flight[];
  returnTrip: Flight[];
  layovers: { hours: number; minutes: number }[][];

  constructor() {
    this.outboundTrip = [];
    this.returnTrip = [];
    this.layovers = [];
  }

  getOriginAndDestinationAirportOfTrip(
    trip: Flight[]
  ): [Airport, Airport] | [null, null] {
    if (trip.length === 0) {
      return [null, null];
    }
    const lastFlightIndex: number = trip.length - 1;

    const originAirport = trip[0].origin;
    const destinationAirport = trip[lastFlightIndex].destination;

    return [originAirport, destinationAirport];
  }

  getTimeDifference(
    date1: Date,
    date2: Date
  ): { hours: number; minutes: number } {
    const timeDifferenceMs: number = date2.getTime() - date1.getTime();

    const totalTimeInMinutes: number = timeDifferenceMs / 1000 / 60;

    const hours: number = Math.floor(totalTimeInMinutes / 60);
    const minutes: number = totalTimeInMinutes % 60;

    return { hours, minutes };
  }

  calculateTripTime(
    trip: Flight[],
    tripLayover: { hours: number; minutes: number }[]
  ): { hours: number; minutes: number } {
    const totalFlightDurationsInMinutes = trip.reduce(
      (totalDuration, currentFlight) => {
        return totalDuration + currentFlight.duration;
      },
      0
    );

    const totalLayoversDurationInMinutes = tripLayover.reduce(
      (totalDuration, currentLayover) => {
        return (
          totalDuration + currentLayover.hours * 60 + currentLayover.minutes
        );
      },
      0
    );

    const totalTripDurationInMinutes =
      totalFlightDurationsInMinutes + totalLayoversDurationInMinutes;

    const hours: number = Math.floor(totalTripDurationInMinutes / 60);
    const minutes: number = totalTripDurationInMinutes % 60;

    return { hours, minutes };
  }

  calculateLayovers(trip: Flight[]): { hours: number; minutes: number }[] {
    if (trip.length - 1 < 1) {
      return [];
    }

    const tripLayovers: { hours: number; minutes: number }[] = [];

    for (let i = 0; i < trip.length; i++) {
      if (trip[i + 1]) {
        const { hours, minutes } = this.getTimeDifference(
          trip[i].arrivingDate,
          trip[i + 1].departureDate
        );

        tripLayovers.push({ hours, minutes });
      }
    }
    return tripLayovers;
  }

  /*generateItineraryLayovers(): void {
    this.calculateLayovers(this.outboundTrip);
    this.calculateLayovers(this.returnTrip);
  }*/

  displayTripInformation(trip: Flight[]): void {
    const lastFlightIndex: number = trip.length - 1;

    const [origin, destination] =
      this.getOriginAndDestinationAirportOfTrip(trip);

    const tripLayovers: { hours: number; minutes: number }[] =
      this.calculateLayovers(trip);

    const totalTripDuration = this.getTimeDifference(
      trip[0].departureDate,
      trip[lastFlightIndex].arrivingDate
    );

    const [
      departureMonth,
      departureDay,
      departureYear,
      departureHour,
      departureMinutes,
    ] = trip[0].deconstructDateDataType(trip[0].departureDate);

    const [
      arrivingMonth,
      arrivingDay,
      arrivingYear,
      arrivingHour,
      arrivingMinutes,
    ] = trip[0].deconstructDateDataType(trip[lastFlightIndex].arrivingDate);

    console.log(
      `${origin?.airportId} to ${destination?.airportId}\n\n${departureMonth} ${departureDay}, ${departureYear}\n`
    );
    console.log(
      `${departureHour}:${departureMinutes}  ..............................  ${arrivingHour}:${arrivingMinutes}`
    );
    console.log(
      `Duration: ${totalTripDuration.hours}h ${totalTripDuration.minutes}m`
    );
    if (tripLayovers.length > 0) {
      console.log(`\nLayovers`);
      for (
        let i = 1, j = 0;
        i < trip.length, j < tripLayovers.length;
        i++, j++
      ) {
        console.log(
          `${trip[i].origin.airportId}: ${tripLayovers[j].hours}h ${tripLayovers[j].minutes}m`
        );
      }
    }
  }
}

const i1 = new Itinerary();

const country1 = new Country("Costa Rica");
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
  new Date("2025-04-29T09:00:00Z"),
  new Date("2025-04-30T11:00:00Z"),
  120
);

i1.displayTripInformation([flight1, flight2]);
//i1.calculateLayovers([flight3]);
//console.log(i1.layovers);
