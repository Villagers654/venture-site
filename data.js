// Benchmark data shown on the site. Source: the 2026-10-21 Windows head-to-head (Venture from current main); The Climb 2,
// Iron Man VR, Deadpool VR and HITMAN 3 VR: Reloaded from the 2026-10-24/25 four-title head-to-head on the same rig;
// Puzzling Places and the AXRB 2.0.0 GLES-installer retest (Bait) from 2026-10-24. The chart shows titles that at least two
// other runtimes ran; single-competitor results (Climb 2: AXRB 1.0.4 122; Cooking: Refract emulator 87; Puzzling: Refract
// emulator 195; Bait: AXRB 2.0.0 229) are in the report.
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
      v: [[280, 199], [168, 133, "*§"], null, null, [97, 42, "*"]] },
    { name: "Deadpool VR", short: "Deadpool", img: "deadpool",
      v: [[324, 212], [226, 106], null, [224, 108, "*"], null] },
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
    ["First Contact", "firstcontact", 343], ["Bait!", "bait", 245, [0, 0, 1, 0]], ["Cactus Cowboy", "cactus", 392],
    ["V-Speedway", "vspeedway", 481], ["Epic Roller Coasters", "epic", 568],
    ["The Climb 2", "climb2", 769, [0, 0, 0, 1]], ["Iron Man VR", "ironman", 280, [1, 0, 0, 1]],
    ["Deadpool VR", "deadpool", 324, [1, 0, 1, 0]], ["HITMAN 3 VR: Reloaded", "hitman3", 172, [0, 0, 0, 0]],
    ["Puzzling Places", "puzzling", 597, [0, 1, 0, 0]],
  ],
  // Linux: the 2026-10-23/24 Linux head-to-head, Venture vs Refract 1.0.2 in Waydroid, mean of 2 runs each, plus the
  // 2026-10-24 Venture-only numbers pass (same method, one run each) for the titles Refract did not reach.
  // 1% low here is 1000 / p99 frame time. Every game above runs on Venture Linux except those in "testing" (not yet
  // validated there, left out of the totals). "extra": Linux-only games for now. "games": Venture fps where measured
  // (null or unlisted: "Runs"), then whether Refract reached gameplay. Refract was attempted on every Linux title.
  linux: {
    hw: "Ryzen 9 7940HS · Radeon RX 7700S · 2000×2040 per eye (Climb 2, Iron Man, Deadpool, HITMAN up to 2800×2856)",
    runtimes: ["Venture", "Refract Waydroid"],
    h2h: [
      { name: "North Star", short: "North Star", img: "northstar", v: [[143, 98], [55, 18]] },
      { name: "Asgard's Wrath 2", short: "Asgard's Wrath 2", img: "aw2", v: [[211, 148], [42, 15]] },
      { name: "Cooking Simulator VR", short: "Cooking Sim", img: "cooking", v: [[302, 207], [45, 39]] },
      { name: "Job Simulator", short: "Job Simulator", img: "jobsim", v: [[180, 175], [29, 27]] },
      { name: "Bait!", short: "Bait!", img: "bait", v: [[70, 68], [26, 22, "*"]] },
      { name: "Puzzling Places", short: "Puzzling Places", img: "puzzling", v: [[205, 180], [40, 17]] },
      { name: "Assassin's Creed Nexus", short: "AC Nexus", img: "acnexus", v: [[199, 145], [71, 29]] },
    ],
    games: { northstar: [143, 1], aw2: [211, 1], cooking: [302, 1], jobsim: [180, 1], bait: [70, 1], puzzling: [205, 1],
      acnexus: [199, 1], batman: [184, 0], re4: [315, 0], beatsaber: [173, 0], vader: [518, 0], vader2: [332, 0],
      vader3: [260, 0], twd: [410, 0], moss: [131, 0], moss2: [215, 0], firstcontact: [285, 0], elixir: [181, 0],
      epic: [247, 0], cactus: [144, 0], vspeedway: [91, 0], climb2: [174, 0], ironman: [172, 0], deadpool: [138, 0],
      hitman3: [126, 0] },
    extra: [],
    testing: [],
  },
};
