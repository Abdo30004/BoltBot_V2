import {
  Client as BaseClient,
  ClientOptions,
  LocalAuth,
} from "whatsapp-web.js";
import { cwd } from "process";

import fs from "fs/promises";
import { Command } from "../interfaces/command";

import { Event } from "../interfaces/event";

import { Collection } from "@discordjs/collection";
import Logger from "../Util/logger";

class Client extends BaseClient {
  public commands: Collection<string, Command> = new Collection();
  private path: string;

  constructor(options?: ClientOptions) {
    const defaultOptions: ClientOptions = {
      puppeteer: {
        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      },
      authStrategy: new LocalAuth(),
    };
    super(Object.assign(defaultOptions, options));
    this.commands = new Collection();
    this.path = cwd();
  }

  protected async registerEvents(dir: string, debug = false): Promise<boolean> {
    try {
      let files = await fs.readdir(dir);

      for (let file of files) {
        let filePath = `${this.path}/${dir}/${file}`;
        let stat = await fs.lstat(filePath);
        if (stat.isDirectory()) {
          await this.registerEvents(filePath);
        }
        if (file.endsWith(".ts")) {
          let { default: event } = (await import(filePath)) as {
            default: Event;
          };
          if (event.once) {
            this.once(event.name, event.run.bind(null, this));
          } else {
            this.on(event.name, event.run.bind(null, this));
          }
          if (debug) Logger.logEventRegistered(event);
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  protected async registerCommands(
    dir: string,
    debug = false
  ): Promise<boolean> {
    try {
      let files = await fs.readdir(dir);
      for (let file of files) {
        let filePath = `${this.path}/${dir}/${file}`;
        let stat = await fs.lstat(filePath);
        if (stat.isDirectory()) {
          await this.registerCommands(filePath);
        }
        if (file.endsWith(".ts")) {
          let { default: cmd } = (await import(filePath)) as {
            default: Command;
          };

          this.commands.set(cmd.name, cmd);
          if (debug) Logger.logCommandRegistered(cmd);
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async start(options: {
    eventsDir: string;
    commandsDir: string;
    debug?: boolean;
  }) {
    let defaultOptions = {
      eventsDir: "events",
      commandsDir: "commands",
      debug: false,
    };
    options = Object.assign(defaultOptions, options);
    await this.registerEvents(options.eventsDir, options.debug);
    await this.registerCommands(options.commandsDir, options.debug);
    await this.initialize();
  }
}

export default Client;
export { Client };
