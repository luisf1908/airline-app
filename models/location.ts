export class City {
  name: string;
  stateId: State;

  constructor(name: string, stateId: State) {
    this.name = name;
    this.stateId = stateId;
  }
}

export class State {
  name: string;
  countryId: Country;

  constructor(name: string, countryId: Country) {
    this.name = name;
    this.countryId = countryId;
  }
}

export class Country {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
