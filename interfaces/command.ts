
import { Client } from "../base/client";
import { Message } from "whatsapp-web.js";
interface Command {
  name: string;
  aliases?: string[];
  execute: (client: Client, message: Message, ...args: any[]) => Promise<void>;
}

export default Command;
export { Command };
