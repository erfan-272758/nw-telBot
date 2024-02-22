import { Request, Response } from "express";
import { Bot } from "../bot";

export class BotController {
  bot: Bot;
  constructor() {
    this.bot = new Bot();
  }
  message = async (req: Request, res: Response) => {
    try {
      const { message, channelId, botToken, ...opts } = req.body ?? {};
      const response = await this.bot.message({
        botToken,
        channelId,
        message,
        ...opts,
      });
      return res.json({ data: response });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  };
}
