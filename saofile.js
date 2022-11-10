const prices = require("./materialprices.json");
const gradient = require("gradient-string");
const fs = require("fs");
const { combineBySummingKeys } = require("./util");
const Handlebars = require("handlebars");

module.exports = {
  prompts: require("./prompts"),
  async completed() {
    const chalk = this.chalk;
    let {
      defaultprices,
      itemtype,
      auto_turrets,
      bullets_per_auto_turret,
      heavy_turrets,
      bullets_per_heavy_turret,
      tek_turrets,
      shards_per_tek_turret,
      cliffplatform_open_edges,
      cliffplatform_turrets_per_cliffplatform_edge,
      cliffplatform_turret_type,
      cliffplatform_turrets_top_and_bottom,
      turrettower_foundations_width,
      turrettower_foundations_length,
      turrettower_foundations_height,
      turrettower_Mid_Part,
      turrettower_Top_Turret_Part,
    } = this.answers;
    turrettower_foundations_width = Number(turrettower_foundations_width);
    turrettower_foundations_length = Number(turrettower_foundations_length);
    turrettower_foundations_height = Number(turrettower_foundations_height);
    console.log(chalk`\n🎉  {bold Calculating prices} {cyan ...}\n`);

    let auto_turret_cost = {};
    let heavy_turret_cost = {};
    let tek_turret_cost = {};
    let auto_turret_bullet_cost = {};
    let heavy_turret_bullet_cost = {};
    let tek_turret_shard_cost = {};
    let total_cost = {};

    const capitalize = (string) =>
      string.charAt(0).toUpperCase() + string.slice(1);

    // TODO: Add support for custom prices
    // TODO: Optimalize this shit
    /**
     *
     * @param {Number} amount
     * @param {String} item_type
     * @returns Object with prices
     */
    const calcItemCost = (amount, item_type) => {
      if (Number.isNaN(amount)) return console.error("Amount is NaN");
      if (!(item_type in prices))
        return console.error(
          "\x1b[31m%s\x1b[0m",
          `[ArkMatCalc Error]: ${item_type} not found in prices`
        );
      let price = {};
      Object.entries(prices[item_type]).forEach((i) => {
        const [key, val] = i;
        if (prices.hasOwnProperty(key)) {
          price = combineBySummingKeys(calcItemCost(val, key), price);
        } else {
          price[`${gradient.vice(capitalize(key))}`] = val * Number(amount);
        }
      });
      return price;
    };

    // const redToGreen = gradient("red", "green");
    // const str = "■".repeat(48);
    // console.log(redToGreen(str));
    if (itemtype == "turrets") {
      if (auto_turrets > 0) {
        auto_turret_cost = calcItemCost(auto_turrets, "auto_turret");

        console.log(gradient.retro("Auto Turrets Cost"));
        console.table(auto_turret_cost);
      }

      if (heavy_turrets > 0) {
        heavy_turret_cost = calcItemCost(heavy_turrets, "heavy_turret");

        console.log(gradient.morning("Heavy Turrets Cost"));
        console.table(heavy_turret_cost);
      }

      if (tek_turrets > 0) {
        tek_turret_cost = calcItemCost(tek_turrets, "tek_turret");

        console.log(gradient.beer("Tek Turrets Cost"));
        console.table(tek_turret_cost);
      }

      if (bullets_per_auto_turret > 0 && auto_turrets > 0) {
        auto_turret_bullet_cost = calcItemCost(
          bullets_per_auto_turret,
          "advanced_bullet"
        );
        console.log(gradient.beer("Auto Turrets Bullets Cost"));
        console.table(auto_turret_bullet_cost);
      }

      if (bullets_per_heavy_turret > 0 && heavy_turrets > 0) {
        heavy_turret_bullet_cost = calcItemCost(
          bullets_per_heavy_turret,
          "advanced_bullet"
        );
        console.log(gradient.beer("Heavy Turrets Bullets Cost"));
        console.table(heavy_turret_bullet_cost);
      }

      if (shards_per_tek_turret > 0 && tek_turrets > 0) {
        tek_turret_shard_cost = calcItemCost(
          shards_per_tek_turret * tek_turrets,
          "element_shard"
        );
        console.log(gradient.beer("Tek Turrets Shards Cost"));
        console.table(tek_turret_shard_cost);
      }

      // calculate total cost
      total_cost = combineBySummingKeys(
        auto_turret_cost,
        heavy_turret_cost,
        tek_turret_cost,
        auto_turret_bullet_cost,
        heavy_turret_bullet_cost,
        tek_turret_shard_cost
      );

      console.table(total_cost);
    } else if (itemtype == "platform_tower") {
      if (cliffplatform_open_edges > 0) {
        let turretamount =
          Number(cliffplatform_open_edges) *
          Number(cliffplatform_turrets_per_cliffplatform_edge) *
          `${cliffplatform_turrets_top_and_bottom ? 2 : 1}`;
        let cost = {};
        switch (cliffplatform_turret_type) {
          case "auto_turret":
            cost = calcItemCost(turretamount, "auto_turret");
            break;
          case "heavy_turret":
            cost = calcItemCost(turretamount, "heavy_turret");
            break;
          case "tek_turret":
            cost = calcItemCost(turretamount, "tek_turret");
            break;

          default:
            break;
        }
        console.log(
          gradient.beer(`Cliff Platform Cost for ${turretamount} turrets`)
        );
        console.table(cost);
      }
    } else if (itemtype == "turret_tower") {
      let amountOfDoubleDoorFramesCenter = 8;
      let topTurretHeight = 7;
      let amountTekTurrets = 65;
      let amountHeavyTurrets = 60;
      let turretRingLevels = [
        {
          height: 10,
          hasGenerator: false,
        },
        {
          height: 14,
          hasGenerator: false,
        },
        {
          height: 18,
          hasGenerator: false,
        },
      ]; // 13, 16, 19, 22?
      if (turrettower_Top_Turret_Part) {
        turretRingLevels.push({
          height: 29,
          hasGenerator: true,
        });
      }

      const Area = (width, length) => width * length;
      const amountCenterPartDoorframes = (doorFramesPerLayer) => {
        return (
          doorFramesPerLayer *
          Number(
            `${
              turrettower_Mid_Part
                ? turrettower_foundations_height +
                  Number(turrettower_Top_Turret_Part ? topTurretHeight : 0)
                : 0
            }`
          )
        );
      };

      let foundationsAmount = Area(
        turrettower_foundations_width,
        turrettower_foundations_length
      );

      let doubleDoorframeOutsideAmount =
        (turrettower_foundations_width + turrettower_foundations_length) *
        2 *
        turrettower_foundations_height;

      let doubleDoorframeCenterAmount = amountCenterPartDoorframes(
        amountOfDoubleDoorFramesCenter
      );

      let giantHatchframesPerLayerAmount = foundationsAmount / 4; // divide by 4 because one giant hatchframe is 2x2 foundations

      /**
       *
       * @param {Number} layers
       * @returns Number of hatchframes needed for the given amount of layers
       */
      const amountHatchframesPerLayer = (layers) => {
        return (
          (giantHatchframesPerLayerAmount -
            Number(turrettower_Mid_Part ? 1 : 0)) *
          layers
        );
      };
      let giantHatchframeAmountLayers = amountHatchframesPerLayer(4); // 3 bottom layers + 1 top layer

      /* 
      TODO: Calculate if one of the levels have generator box or center turret. If so, add 1 to the amount. 
      */
      let giantHatchframesCenterAmount = turrettower_Mid_Part
        ? 8 * turretRingLevels.length
        : 0;

      // TODO: Calculate hatchframes edges per turret layer for amount of turrets
      // Loop trough turretRingLevels and add one tek turret if hasGenerator is true since generator should have one turret beneath it
      // calculate amount of double doorframs per layer and plus 4 for edges.
      const calcTurretsPerLayerCenter = () => {
        let perSide = 3;
        let turretPerSide = perSide * 2;
        let turretTotal = (turretPerSide * 4) / 2;
        return turretTotal;
      };

      console.table({
        [`Foundations (\x1b[31m${foundationsAmount}\x1b[0m)`]: calcItemCost(
          foundationsAmount,
          "metal_foundation"
        ),
        [`Double Doorframes (\x1b[31m${
          doubleDoorframeOutsideAmount + doubleDoorframeCenterAmount
        }\x1b[0m)`]: calcItemCost(
          doubleDoorframeOutsideAmount + doubleDoorframeCenterAmount,
          "double_doorframe"
        ),
        [`Giant Hatchframes (\x1b[31m${
          giantHatchframeAmountLayers + giantHatchframesCenterAmount
        }\x1b[0m)`]: calcItemCost(
          giantHatchframeAmountLayers + giantHatchframesCenterAmount,
          "giant_metal_hatchframe"
        ),
        [`Heavy Turrets (\x1b[31m${amountHeavyTurrets}\x1b[0m)`]: calcItemCost(
          amountHeavyTurrets,
          "heavy_turret"
        ),
        [`Tek Turrets (\x1b[31m${amountTekTurrets}\x1b[0m)`]: calcItemCost(
          amountTekTurrets,
          "tek_turret"
        ),
        [""]: {},
        [`Total Cost`]: combineBySummingKeys(
          calcItemCost(foundationsAmount, "metal_foundation"),
          calcItemCost(
            doubleDoorframeOutsideAmount + doubleDoorframeCenterAmount,
            "double_doorframe"
          ),
          calcItemCost(
            giantHatchframeAmountLayers + giantHatchframesCenterAmount,
            "giant_metal_hatchframe"
          ),
          calcItemCost(amountHeavyTurrets, "heavy_turret"),
          calcItemCost(amountTekTurrets, "tek_turret")
        ),
      });
    }
  },
};
