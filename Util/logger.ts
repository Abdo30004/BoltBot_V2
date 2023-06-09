import moment from "moment";
import chalk from "chalk";

import { Message, Contact, Chat } from "whatsapp-web.js";

import { Event } from "../interfaces/event";

import Command from "../interfaces/command";

class Logger {
  public static logCommandRun(
    message: Message,
    author: Contact,
    chat: Chat
  ): void {
    console.log(
      `${chalk.green.underline.bold("WhatsApp:")} ${chalk.red.bold(
        author.pushname
      )} used ${chalk.greenBright.bold(message.body)} in ${chalk.blue.bold(
        chat.name
      )}/${chalk.bold(chat.isGroup ? "Groupe" : "DM")} (${chalk.cyanBright.bold(
        chat.id._serialized
      )}) at ${chalk.yellow.bold(moment(new Date()).format("MM-DD-YYYY LTS"))}`
    );
  }
  public static logEventRegistered(event: Event): void {
    console.log(
      `${chalk.green.underline.bold("Event:")} ${chalk.red.bold(
        event.name
      )} has been registered`
    );
  }
  public static logCommandRegistered(command: Command): void {
    console.log(
      `${chalk.green.underline.bold("Command:")} ${chalk.red.bold(
        command.name
      )} has been registered`
    );
  }
}
export default Logger;
export { Logger };
