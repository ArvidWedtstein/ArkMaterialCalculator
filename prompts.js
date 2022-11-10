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
    name: "itemtype",
    message: "Choose type of item you want to get costs for:",
    type: "list",
    choices: [
      { name: "Turrets", value: "turrets" },
      { name: "Turret Tower", value: "turret_tower" },
      { name: "Cliff Plat Turret Tower", value: "platform_tower" },
    ],
    default: "turrets",
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
    when: ({ itemtype }) => itemtype == "turrets",
    name: "auto_turrets",
    message: gradient.morning("Amount Auto Turrets:"),
    default: 0,
  },
  {
    when: ({ auto_turrets, itemtype }) =>
      auto_turrets > 0 && itemtype == "turrets",
    name: "bullets_per_auto_turret",
    message: gradient.morning("Bullets per Auto Turret:"),
    default: 0,
  },
  {
    when: ({ itemtype }) => itemtype == "turrets",
    name: "heavy_turrets",
    message: gradient.morning("Amount Heavy Turrets:"),
    default: 0,
  },
  {
    when: ({ heavy_turrets, itemtype }) =>
      heavy_turrets > 0 && itemtype == "turrets",
    name: "bullets_per_heavy_turret",
    message: gradient.morning("Bullets per Heavy Turret:"),
    default: 0,
  },
  {
    when: ({ itemtype }) => itemtype == "turrets",
    name: "tek_turrets",
    message: gradient.morning("Amount Tek Turrets:"),
    default: 0,
  },
  {
    when: ({ tek_turrets, itemtype }) =>
      tek_turrets > 0 && itemtype == "turrets",
    name: "shards_per_tek_turret",
    message: gradient.morning("Shards per Tek Turret:"),
    default: 0,
  },
  // Cliff plat tower
  {
    when: ({ itemtype }) => itemtype == "platform_tower",
    name: "cliffplatform_open_edges",
    message: gradient.morning("Cliffplatform edges away from wall:"),
    default: 0,
  },
  {
    when: ({ itemtype }) => itemtype == "platform_tower",
    name: "cliffplatform_turret_type",
    message: gradient.morning("Choose turret type:"),
    choices: [
      { name: "Auto Turret", value: "auto_turret" },
      { name: "Heavy Turret", value: "heavy_turret" },
      { name: "Tek Turret", value: "tek_turret" },
      { name: "Plant X Turret", value: "plant_x_turret" },
    ],
    type: "list",
    default: "plant_x", // do stuff here for customizing own prices
  },
  {
    when: ({ itemtype }) => itemtype == "platform_tower",
    name: "cliffplatform_turrets_per_cliffplatform_edge",
    message: gradient.morning("How many turrets per platform edge?:"),
    default: 0,
  },
  {
    when: ({ itemtype }) => itemtype == "platform_tower",
    name: "cliffplatform_turrets_top_and_bottom",
    message: gradient.morning("Turrets on top and bottom?:"),
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false },
    ],
    type: "list",
    default: "no",
  },
  // Turret Skeleton Tower
  {
    when: ({ itemtype }) => itemtype == "turret_tower",
    name: "turrettower_foundations_width",
    message: gradient.morning("Turret Cage Foundations Width:"),
    default: 14,
  },
  {
    when: ({ itemtype }) => itemtype == "turret_tower",
    name: "turrettower_foundations_length",
    message: gradient.morning("Turret Cage Foundations Length:"),
    default: 14,
  },
  {
    when: ({ itemtype }) => itemtype == "turret_tower",
    name: "turrettower_foundations_height",
    message: gradient.morning("Turret Cage Height:"),
    default: 22,
  },
  {
    when: ({ itemtype }) => itemtype == "turret_tower",
    name: "turrettower_Mid_Part",
    message: gradient.morning("Mid center part:"),
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false },
    ],
    type: "list",
    default: true,
  },
  {
    when: ({ itemtype }) => itemtype == "turret_tower",
    name: "turrettower_Top_Turret_Part",
    message: gradient.morning("Top Turret part in center?"),
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false },
    ],
    type: "list",
    default: true,
  },
];
