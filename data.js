// Benchmark data shown on the site. Source: the 2026-10-21 Windows head-to-head (Venture from current main); The Climb 2,
// Iron Man VR, Deadpool VR and HITMAN 3 VR: Reloaded from the 2026-10-23 run on the same rig.
// Values: [fps, 1% low fps] per runtime; null = did not reach gameplay. Marks: "*" fewer pixels,
// "†" modified to run, "‡" configuration changed to run, "§" different field of view.
window.VENTURE_DATA = {
  runtimes: ["Venture", "Refract Native", "Refract emulator", "AXRB 2.0.0", "AXRB 1.0.4"],
  h2h: [
    { name: "North Star", short: "North Star", img: "northstar",
      v: [[289, 208], [151, 102], [106, 65], [132, 102, "*"], [101, 63, "*‡"]] },
    { name: "Assassin's Creed Nexus", short: "AC Nexus", img: "acnexus",
      v: [[290, 196], [219, 133], [153, 89], [46, 40, "*"], [45, 38, "*‡"]] },
    { name: "Batman: Arkham Shadow", short: "Batman", img: "batman",
      v: [[345, 231], [176, 91], [136, 76], [130, 70], [94, 52, "‡"]] },
    { name: "Resident Evil 4", short: "Resident Evil 4", img: "re4",
      v: [[459, 394], [352, 141, "†"], null, [11, 8], null] },
    { name: "Asgard's Wrath 2", short: "Asgard's Wrath 2", img: "aw2",
      v: [[471, 386], [247, 185], null, [152, 125, "‡"], null] },
    { name: "Iron Man VR", short: "Iron Man", img: "ironman",
      v: [[287, 229], [168, 133, "*§"], null, null, [97, 42, "*"]] },
    { name: "Deadpool VR", short: "Deadpool", img: "deadpool",
      v: [[335, 229, "*"], null, null, [224, 108, "*"], null] },
  ],
  // The grid's order: what people care about most first (popular Quest exclusives lead), series kept together in order.
  order: ["batman", "aw2", "beatsaber", "re4", "acnexus", "ironman", "deadpool", "hitman3", "vader", "vader2", "vader3",
    "twd", "moss", "moss2", "climb2", "jobsim", "firstcontact", "puzzling", "cooking", "elixir", "epic", "bait",
    "cactus", "vspeedway", "northstar"],
  // Which competitors reached gameplay (Refract Native, Refract emulator, AXRB 2.0.0, AXRB 1.0.4).
  games: [
    ["North Star", "northstar", 289, [1, 1, 1, "‡"]], ["Batman: Arkham Shadow", "batman", 345, [1, 1, 1, "‡"]],
    ["Assassin's Creed Nexus", "acnexus", 290, [1, 1, 1, "‡"]], ["Asgard's Wrath 2", "aw2", 471, [1, 0, "‡", 0]],
    ["Resident Evil 4", "re4", 459, ["†", 0, 1, 0]], ["Cooking Simulator VR", "cooking", 556, [0, 1, 0, 0]],
    ["Beat Saber", "beatsaber", 753], ["Moss", "moss", 460], ["Moss: Book II", "moss2", 589],
    ["Vader Immortal I", "vader", 719], ["Vader Immortal II", "vader2", 511], ["Vader Immortal III", "vader3", 638],
    ["TWD: Saints & Sinners", "twd", 497], ["Job Simulator", "jobsim", 694], ["Elixir", "elixir", 856],
    ["First Contact", "firstcontact", 343], ["Bait!", "bait", 245], ["Cactus Cowboy", "cactus", 392],
    ["V-Speedway", "vspeedway", 481], ["Epic Roller Coasters", "epic", 568],
    ["The Climb 2", "climb2", 727, [0, 0, 0, 0]], ["Iron Man VR", "ironman", 287, [1, 0, 0, 1]],
    ["Deadpool VR", "deadpool", 335, [0, 0, 1, 0]], ["HITMAN 3 VR: Reloaded", "hitman3", 180, [0, 0, 0, 0]],
  ],
  // Linux (preliminary): the 2026-10-23 Linux head-to-head, Venture vs Refract 1.0.2 in Waydroid, mean of 2 runs each.
  // 1% low here is 1000 / p99 frame time. Every game above runs on Venture Linux except those in "testing" (not yet
  // validated there, left out of the totals). "extra": Linux-only games for now. "games": Venture fps where measured
  // (null or unlisted: "Runs"), then whether Refract reached gameplay. Refract was attempted on every Linux title.
  linux: {
    hw: "Ryzen 9 7940HS · Radeon RX 7700S · 2000×2040 per eye",
    runtimes: ["Venture", "Refract Waydroid"],
    h2h: [
      { name: "North Star", short: "North Star", img: "northstar", v: [[143, 98], [55, 18]] },
      { name: "Asgard's Wrath 2", short: "Asgard's Wrath 2", img: "aw2", v: [[211, 148], [42, 15]] },
      { name: "Cooking Simulator VR", short: "Cooking Sim", img: "cooking", v: [[302, 207], [45, 39]] },
      { name: "Job Simulator", short: "Job Simulator", img: "jobsim", v: [[180, 175], [29, 27]] },
      { name: "Bait!", short: "Bait!", img: "bait", v: [[70, 68], [26, 22, "*"]] },
      { name: "Puzzling Places", short: "Puzzling Places", img: "puzzling", v: [[205, 180], [40, 17]] },
    ],
    games: { northstar: [143, 1], aw2: [211, 1], cooking: [302, 1], jobsim: [180, 1], bait: [70, 1], puzzling: [205, 1],
      acnexus: [null, 1] },
    extra: [["Puzzling Places", "puzzling"]],
    testing: ["climb2", "ironman", "deadpool", "hitman3"],
  },
};
