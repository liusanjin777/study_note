class Aircraft {
  ordinary() {
    console.log("发射普通子弹");
  }
}

class AircraftDecorator {
  constructor(Aircraft) {
    this.aircraft = Aircraft;
  }
  laser() {
    console.log("发射激光");
  }
  guidedMissile() {
    console.log("发射导弹");
  }
  ordinary() {
    this.aircraft.ordinary();
  }
}
