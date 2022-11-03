const prices = require('./materialprices.json');
const gradient = require("gradient-string");
const fs = require('fs')



const addExecutable = filename => new Promise(
  resolve => fs.chmod(filename, 0o755, resolve)
)


module.exports = {
  prompts: require('./prompts'),
  async completed () {

    const chalk = this.chalk
    const { defaultprices, auto_turrets, bullets_per_auto_turret, heavy_turrets, bullets_per_heavy_turret, tek_turrets, shards_per_tek_turret } = this.answers

    console.log(chalk`\n🎉  {bold Calculating prices} {cyan ...}\n`)

    let auto_turret_cost = {}
    let heavy_turret_cost = {}
    let tek_turret_cost = {}
    let auto_turret_bullet_cost = {}
    let heavy_turret_bullet_cost = {}
    let tek_turret_shard_cost = {}
    let total_cost = {}

    const calcAutoTurretCost = (amount) => {
        let price = {}
        Object.entries(prices.auto_turret).forEach((i) => {
            const [key, val] = i
            price[key] = val * Number(amount)
        });
        return price
    }

    auto_turret_cost = calcAutoTurretCost(auto_turrets)

    Object.entries(prices.heavy_turret).forEach((i) => {
        const [key, val] = i

        heavy_turret_cost[key] = (val * Number(heavy_turrets)) + (Object.fromEntries(Object.entries(prices.auto_turret))[key] * Number(heavy_turrets))
        
    });


    Object.entries(prices.tek_turret).forEach((i) => {
        const [key, val] = i
        tek_turret_cost[key] = val * Number(tek_turrets)
    });

    if (bullets_per_auto_turret > 0) {
        Object.entries(prices.advanced_bullet).forEach((i) => {
            const [key, val] = i
            auto_turret_bullet_cost[key] = val * Number(bullets_per_auto_turret) * Number(auto_turrets)
        });
    }

    if (bullets_per_heavy_turret > 0) {
        Object.entries(prices.advanced_bullet).forEach((i) => {
            const [key, val] = i
            heavy_turret_bullet_cost[key] = val * Number(bullets_per_heavy_turret) * Number(heavy_turrets)
        });
    }

    if (shards_per_tek_turret > 0) {
        tek_turret_shard_cost['element'] = (Number(shards_per_tek_turret) / 100) * Number(tek_turrets)
    }
    if (Number(auto_turrets) > 0) {
        console.log(gradient.morning('Auto Turrets Cost')); 
        console.table(auto_turret_cost)
    }
    if (Number(heavy_turrets) > 0) {
        console.log('Heavy Turrets Cost'); 
        console.table(heavy_turret_cost)
    }
    if (Number(tek_turrets) > 0) {
        console.log('Tek Turrets Cost'); 
        console.table(tek_turret_cost)
    }

    // if (bullets_per_auto_turret > 0) console.table(auto_turret_bullet_cost)
    // if (bullets_per_heavy_turret > 0) console.table(heavy_turret_bullet_cost)
    // if (shards_per_tek_turret > 0) console.table(tek_turret_shard_cost)


    // calculate total cost
    Object.entries(auto_turret_cost).forEach((i) => {
        const [key, val] = i
        total_cost[key] = val
    });
    Object.entries(heavy_turret_cost).forEach((i) => {
        const [key, val] = i
        total_cost[key] = (total_cost[key] || 0) + val
    });
    Object.entries(tek_turret_cost).forEach((i) => {
        const [key, val] = i
        total_cost[key] = (total_cost[key] || 0) + val
    });
    if (Number(bullets_per_auto_turret) > 0) {
        Object.entries(auto_turret_bullet_cost).forEach((i) => {
            const [key, val] = i
            total_cost[key] = (total_cost[key] || 0) + val
        });
    }
    if (Number(bullets_per_heavy_turret) > 0) {
        Object.entries(heavy_turret_bullet_cost).forEach((i) => {
            const [key, val] = i
            total_cost[key] = (total_cost[key] || 0) + val
        });
    }

    if (Number(shards_per_tek_turret) > 0) {
        Object.entries(tek_turret_shard_cost).forEach((i) => {
            const [key, val] = i
            total_cost[key] = (total_cost[key] || 0) + val
        });
    }

    console.log(total_cost)
  }
}