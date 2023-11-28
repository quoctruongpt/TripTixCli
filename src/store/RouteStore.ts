import { observable, action, makeObservable } from "mobx";

class Route {
  seatSelected = [];
  routeInfo = {};
  userInformation = {};

  constructor() {
    makeObservable(this, {
      seatSelected: observable,
      routeInfo: observable,
      userInformation: observable,
      setSeatSelected: action,
      setRouteInfo: action,
      setUserInformation: action,
    });
  }

  setSeatSelected = (value: string[]) => {
    this.seatSelected = value;
  };

  setRouteInfo = (value: any) => {
    this.routeInfo = value;
  };

  setUserInformation = (value: Record<string, string>) => {
    this.userInformation = value;
  };
}

export { Route };
