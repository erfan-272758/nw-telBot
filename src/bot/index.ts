import { Telegraf } from "telegraf";
export class Bot {
  constructor() {}

  async message({
    channelId,
    botToken,
    message,
    ...opts
  }: {
    channelId: number;
    botToken: string;
    message: string;
    [key: string]: any;
  }) {
    const bot = new Telegraf(botToken);
    await bot.telegram.sendMessage(channelId, message, {
      parse_mode: "HTML",
      ...opts,
    });
  }
}
