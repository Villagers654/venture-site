// Benchmark data shown on the site. Source: the 2026-10-21 Windows head-to-head (Venture from current main).
// Values: [fps, 1% low fps] per runtime; null = did not reach gameplay. Marks: "*" fewer pixels,
// "†" modified to run, "‡" configuration changed to run.
window.VENTURE_DATA = {
  runtimes: ["Venture", "Refract Native", "Refract emulator", "AXRB 2.0.0", "AXRB 1.0.4"],
  h2h: [
    { name: "North Star", short: "North Star", img: "northstar",
      v: [[289, 208], [151, 102], [106, 65], [93, 74, "*"], [101, 63, "*‡"]] },
    { name: "Assassin's Creed Nexus", short: "AC Nexus", img: "acnexus",
      v: [[290, 196], [219, 133], [153, 89], [45, 40, "*"], [45, 38, "*‡"]] },
    { name: "Batman: Arkham Shadow", short: "Batman", img: "batman",
      v: [[345, 231], [176, 91], [136, 76], [111, 94], [94, 52, "‡"]] },
    { name: "Resident Evil 4", short: "Resident Evil 4", img: "re4",
      v: [[459, 394], [352, 141, "†"], null, [13, 7, "†"], null] },
    { name: "Asgard's Wrath 2", short: "Asgard's Wrath 2", img: "aw2",
      v: [[471, 386], [247, 185], null, [152, 125, "‡"], null] },
  ],
  // Which competitors reached gameplay (Refract Native, Refract emulator, AXRB 2.0.0, AXRB 1.0.4).
  games: [
    ["North Star", "northstar", 289, [1, 1, 1, "‡"]], ["Batman: Arkham Shadow", "batman", 345, [1, 1, 1, "‡"]],
    ["Assassin's Creed Nexus", "acnexus", 290, [1, 1, 1, "‡"]], ["Asgard's Wrath 2", "aw2", 471, [1, 0, "‡", 0]],
    ["Resident Evil 4", "re4", 459, ["†", 0, "†", 0]], ["Cooking Simulator VR", "cooking", 556, [0, 1, 0, 0]],
    ["Beat Saber", "beatsaber", 753], ["Moss", "moss", 460], ["Moss: Book II", "moss2", 589],
    ["Vader Immortal I", "vader", 719], ["Vader Immortal II", "vader2", 511], ["Vader Immortal III", "vader3", 638],
    ["TWD: Saints & Sinners", "twd", 935], ["Job Simulator", "jobsim", 694], ["Elixir", "elixir", 856],
    ["First Contact", "firstcontact", 343], ["Bait!", "bait", 245], ["Cactus Cowboy", "cactus", 392],
    ["V-Speedway", "vspeedway", 481], ["Epic Roller Coasters", "epic", 568],
  ],
};
