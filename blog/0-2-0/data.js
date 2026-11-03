// Numbers behind the 0.2.0 post's charts: 0.2.0 against 0.1.0 on the Windows test machine, same routes.
// NOT MEASURED YET. Every value is null, which draws the chart as a "numbers coming" outline at its final size;
// a chart switches to real bars once every value in the view it shows is a number. Values are
// [0.2.0, 0.1.0] per game. Add, remove or reorder games freely (the charts sort by 0.1.0, worst first).
window.POST_DATA = {
  versions: ["0.2.0", "0.1.0"],
  hw: "Core Ultra 9 285K · RTX 5090 · 2800×2856 per eye",
  // Seconds lost to hitches over the route. first: no saved translations or pipelines (fresh install);
  // next: the launch after that.
  stutter: [
    { short: "North Star", first: [null, null], next: [null, null] },
    { short: "Batman", first: [null, null], next: [null, null] },
    { short: "Resident Evil 4", first: [null, null], next: [null, null] },
    { short: "AC Nexus", first: [null, null], next: [null, null] },
    { short: "Asgard's Wrath 2", first: [null, null], next: [null, null] },
  ],
  // Steady state. fps: average fps; low: 1% low fps (1000 / p99 frame time), as on the home page.
  fps: [
    { short: "North Star", fps: [null, null], low: [null, null] },
    { short: "Batman", fps: [null, null], low: [null, null] },
    { short: "Resident Evil 4", fps: [null, null], low: [null, null] },
    { short: "AC Nexus", fps: [null, null], low: [null, null] },
    { short: "Asgard's Wrath 2", fps: [null, null], low: [null, null] },
  ],
};
