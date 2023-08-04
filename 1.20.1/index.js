// Main Library
const mineflayer = require("mineflayer");

const ChatUtils = require("./chat-utils").ChatUtils;

// Pathfinder
const pathfinder = require("mineflayer-pathfinder").pathfinder;
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;

// Load Options
const { options } = require("./config.js");

// Flags
let operator = process.env.MCOPERATOR;
let autoJump = true;
let autoJumpTimeout = 180000;
let autoSleep = true;
let alreadySleeping = false;

function createBot() {
  const bot = mineflayer.createBot(options);

  bot.loadPlugins([pathfinder]);

  const chatUtils = new ChatUtils(bot, operator);

  bot.on("login", function () {
    console.log("[ BOT ]: Joined To Server");
  });

  bot.once("spawn", () => {
    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);

    chatUtils.chat("Joined To Server");
    console.log(bot.entity.position);

    avoidAfk();

    bot.on("chat", (username, message) => {
      if (username == bot.username) return;
      const target = bot.players[username]
        ? bot.players[username].entity
        : null;
      if (message === "DC!come") {
        if (!target) {
          bot.chat("I don't see you !");
          return;
        }
        const p = target.position;

        bot.pathfinder.setMovements(defaultMove);
        bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));
      }

      if (message == "sleep") {
        goToSleep();
      }

      if (message == "DC!autosleep") {
        if (autoSleep) {
          chatUtils.whisper("Setting autosleep false");
          autoSleep = false;
        } else {
          chatUtils.whisper("Setting autosleep true");
          autoSleep = true;
        }
      }
    });

    // Custom chat patterns
    bot.addChatPattern("hello_world", /hello/gi, {
      repeat: true,
    });
    bot.addChatPattern("bot_position", /bot pos/, { repeat: true });
  });

  function avoidAfk() {
    setInterval(() => {
      if (autoJump) {
        chatUtils.whisper("Jumping Once");
        bot.setControlState("jump", true);
        bot.setControlState("jump", false);
      }
    }, autoJumpTimeout);
  }

  async function goToSleep() {
    const bed = bot.findBlock({
      matching: (block) => bot.isABed(block),
      maxDistance: 100,
    });
    if (bed) {
      try {
        alreadySleeping = true;
        await bot.sleep(bed);
        chatUtils.chat("I'm sleeping");
      } catch (err) {
        if (!alreadySleeping) {
          chatUtils.whisper(`I can't sleep: ${err.message}`);
        }
      }
    } else {
      chatUtils.whisper("No nearby bed");
    }
  }

  bot.on("health", () => {
    chatUtils.whisper(`Food: ${parseInt(bot.food)}`);
    chatUtils.whisper(`Health: ${parseInt(bot.health)}`);
  });

  bot.on("sleep", () => {
    bot.chat("Good night!");
  });

  bot.on("time", () => {
    if (!bot.time.isDay) {
      if (!alreadySleeping) {
        goToSleep();
      }
    }
  });

  bot.on("error", console.log);
  
  bot.on("kicked", (reason, loggedIn) => console.log(reason, loggedIn));

  bot.on("end", createBot);

  // Other chat commands
  bot.on("chat:hello_world", (username) => {
    if (username == bot.username) return;
    chatUtils.chat("Hello");
  });

  bot.on("chat:bot_position", (username) => {
    if (username == bot.username) return;
    let coords = Object.values(bot.entity.position).map((co) => {
      return parseInt(co);
    });

    chatUtils.chat(`${coords.join(" ")}`);
  });
}

createBot();