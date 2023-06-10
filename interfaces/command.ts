import { Client } from "../base/client";
import { Message } from "whatsapp-web.js";
import { CommandLocal } from "../i18n/classes/command";

interface Command {
  name: string;
  aliases?: string[];
  execute: (
    client: Client,
    message: Message,
    commandTanslate: CommandLocal ,
    ...args: any[]
  ) => Promise<void>;
}

export default Command;

export { Command };
