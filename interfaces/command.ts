import { Client } from "../base/client";
import { Message } from "whatsapp-web.js";
import { CommandLocal } from "../i18n/classes/command";

interface Command {
  name: string;
  aliases?: string[];
  cooldown?: number;
  execute: (
    client: Client,
    message: Message,
    commandTanslate: CommandLocal,
    ...args: any[]
  ) => Promise<boolean>;
}

export default Command;

export { Command };
