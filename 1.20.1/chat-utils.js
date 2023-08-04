class ChatUtils {
  prefix = "";

  constructor(bot, operator) {
    this.bot = bot;
    this.operator = operator;
  }

  chat(message) {
    this.bot.chat(`${this.prefix}${message}`);
  }

  whisper(message) {
    this.bot.whisper(this.operator, `${message}`);
  }
}

module.exports = {
  ChatUtils,
};