const gradient = require("gradient-string");
module.exports = [
  {
    name: "defaultprices",
    message: "Do you want to use default Eliteark prices?:",
    type: "list",
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false },
    ],
    default: "Yes",
  },
  {
    when: ({ defaultprices }) => defaultprices == false,
    name: "areyousure",
    message: gradient.morning("Er du sikker på at du vil bruke Tailwind??:"),
    choices: [
      { name: "Yes", value: "yes" },
      { name: "No", value: "no" },
    ],
    type: "list",
    default: "no", // do stuff here for customizing own prices
  },
  {
    name: "auto_turrets",
    message: gradient.morning("Amount Auto Turrets:"),
    default: 0,
  },
  {
    when: ({ auto_turrets }) => auto_turrets > 0,
    name: "bullets_per_auto_turret",
    message: gradient.morning("Bullets per Auto Turret:"),
    default: 0, 
  },
  {
    name: "heavy_turrets",
    message: gradient.morning("Amount Heavy Turrets:"),
    default: 0,
  },
  {
    when: ({ heavy_turrets }) => heavy_turrets > 0,
    name: "bullets_per_heavy_turret",
    message: gradient.morning("Bullets per Heavy Turret:"),
    default: 0, 
  },
  {
    name: "tek_turrets",
    message: gradient.morning("Amount Tek Turrets:"),
    default: 0,
  },
  {
    when: ({ tek_turrets }) => tek_turrets > 0,
    name: "shards_per_tek_turret",
    message: gradient.morning("Shards per Tek Turret:"),
    default: 0, 
  },
];
