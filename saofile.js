const prices = require('./materialprices.json');

const fs = require('fs')



const addExecutable = filename => new Promise(
  resolve => fs.chmod(filename, 0o755, resolve)
)


module.exports = {
  prompts: require('./prompts'),
  async completed () {
    console.log(this.answers)
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


    Object.entries(prices.auto_turret).forEach((i) => {
        const [key, val] = i
        auto_turret_cost[key] = val * auto_turrets
    });

    Object.entries(prices.heavy_turret).forEach((i) => {
        const [key, val] = i
        heavy_turret_cost[key] = val * heavy_turrets
    });

    Object.entries(prices.tek_turret).forEach((i) => {
        const [key, val] = i
        tek_turret_cost[key] = val * tek_turrets
    });

    if (bullets_per_auto_turret > 0) {
        Object.entries(prices.advanced_bullet).forEach((i) => {
            const [key, val] = i
            auto_turret_bullet_cost[key] = val * bullets_per_auto_turret * auto_turrets
        });
    }

    if (bullets_per_heavy_turret > 0) {
        Object.entries(prices.advanced_bullet).forEach((i) => {
            const [key, val] = i
            heavy_turret_bullet_cost[key] = val * bullets_per_heavy_turret * heavy_turrets
        });
    }

    if (shards_per_tek_turret > 0) {
        Object.entries(prices.tek_shard).forEach((i) => {
            const [key, val] = i
            tek_turret_shard_cost[key] = val * shards_per_tek_turret * tek_turrets
        });
    }
    if (auto_turrets > 0) console.log(auto_turret_cost)
    if (heavy_turrets > 0) console.log(heavy_turret_cost)
    if (tek_turrets > 0) console.log(tek_turret_cost)
    if (bullets_per_auto_turret > 0) console.log(auto_turret_bullet_cost)
    if (bullets_per_heavy_turret > 0) console.log(heavy_turret_bullet_cost)
    if (shards_per_tek_turret > 0) console.log(tek_turret_shard_cost)
    
    total_cost = {...auto_turret_cost, ...heavy_turret_cost, ...tek_turret_cost, ...auto_turret_bullet_cost, ...heavy_turret_bullet_cost, ...tek_turret_shard_cost}

    console.log(total_cost)
  }
}