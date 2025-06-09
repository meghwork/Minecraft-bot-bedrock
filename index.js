const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const collectBlock = require('mineflayer-collectblock').plugin;
const toolPlugin = require('mineflayer-tool').plugin;
const vec3 = require('vec3');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'Yeahdidy_boi.aternos.me',
    port: 19186,
    username: 'Helper_Bot_' + Math.floor(Math.random() * 1000),
    version: '1.12',
    auth: 'offline'
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(collectBlock);
  bot.loadPlugin(toolPlugin);

  bot.once('spawn', () => {
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
    console.log(`✅ Bot '${bot.username}' is online.`);
    bot.chat("Hello! I'm your helper bot.");
  });

  bot.on('chat', async (username, message) => {
    if (username === bot.username) return;

    const player = bot.players[username]?.entity;
    if (!player) return bot.chat("I can't see you!");

    const pos = player.position;

    // Commands
    if (message === 'come') {
      bot.chat('Coming to you!');
      bot.pathfinder.setGoal(new goals.GoalNear(pos.x, pos.y, pos.z, 1));
    }

    if (message === 'follow') {
      bot.chat('Following you...');
      bot.pathfinder.setGoal(new goals.GoalFollow(player, 1), true);
    }

    if (message === 'stop') {
      bot.chat('Stopping.');
      bot.pathfinder.setGoal(null);
    }

    if (message === 'mine') {
      bot.chat('Looking for stone...');
      const block = bot.findBlock({
        matching: b => b.name === 'stone',
        maxDistance: 16
      });

      if (!block) return bot.chat('No stone nearby!');
      await bot.tool.equipForBlock(block);
      await bot.collectBlock.collect(block);
      bot.chat('Done mining!');
    }

    if (message === 'collect') {
      bot.chat('Collecting nearby items...');
      const items = Object.values(bot.entities).filter(e => e.objectType === 'Item');
      for (const item of items) {
        bot.pathfinder.setGoal(new goals.GoalNear(item.position.x, item.position.y, item.position.z, 1));
      }
    }

    if (message === 'guard') {
      bot.chat('Guard mode on! Attacking nearby mobs...');
      bot.on('physicsTick', () => {
        const mob = bot.nearestEntity(e => e.type === 'mob');
        if (mob) bot.attack(mob);
      });
    }

    if (['hi', 'hello', 'help'].includes(message)) {
      bot.chat("Hi! I respond to: come, follow, stop, mine, collect, guard.");
    }
  });

  bot.on('error', err => {
    console.log('❌ Bot error:', err.message);
  });

  bot.on('end', () => {
    console.log('🔁 Disconnected. Reconnecting in 10s...');
    setTimeout(createBot, 10000);
  });
}

createBot();
