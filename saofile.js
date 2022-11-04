const prices = require("./materialprices.json");
const gradient = require("gradient-string");
const fs = require("fs");
const { combineBySummingKeys } = require("./util");
const Handlebars = require("handlebars");

module.exports = {
  prompts: require("./prompts"),
  async completed() {
    const chalk = this.chalk;
    const {
      defaultprices,
      itemtype,
      auto_turrets,
      bullets_per_auto_turret,
      heavy_turrets,
      bullets_per_heavy_turret,
      tek_turrets,
      shards_per_tek_turret,
      cliffplatform_open_edges,
      turrets_per_cliffplatform_edge,
      cliffplatform_turret_type,
      turrets_top_and_bottom,
    } = this.answers;

    console.log(chalk`\n🎉  {bold Calculating prices} {cyan ...}\n`);

    let auto_turret_cost = {};
    let heavy_turret_cost = {};
    let tek_turret_cost = {};
    let auto_turret_bullet_cost = {};
    let heavy_turret_bullet_cost = {};
    let tek_turret_shard_cost = {};
    let total_cost = {};

    const calcItemCost = (amount, item_type) => {
      if (Number.isNaN(amount)) return console.error("Amount is NaN");
      if (!(item_type in prices))
        return console.error("Item type not found in prices");
      let price = {};
      Object.entries(prices[item_type]).forEach((i) => {
        const [key, val] = i;
        price[key] = val * Number(amount);
      });
      return price;
    };

    if (itemtype == "turrets") {
      if (auto_turrets > 0) {
        auto_turret_cost = calcItemCost(auto_turrets, "auto_turret");

        console.log(gradient.morning("Auto Turrets Cost"));
        console.table(auto_turret_cost);
      }

      if (heavy_turrets > 0) {
        let tempautocost = calcItemCost(heavy_turrets, "auto_turret");
        let tempheavycost = calcItemCost(heavy_turrets, "heavy_turret");

        heavy_turret_cost = combineBySummingKeys(tempautocost, tempheavycost);

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
          Number(turrets_per_cliffplatform_edge) *
          `${turrets_top_and_bottom ? 2 : 1}`;
        let cost = {};
        switch (cliffplatform_turret_type) {
          case "auto_turret":
            cost = calcItemCost(turretamount, "auto_turret");
            break;
          case "heavy_turret":
            cost = combineBySummingKeys(
              calcItemCost(turretamount, "auto_turret"),
              calcItemCost(turretamount, "heavy_turret")
            );
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
    }
  },
};
