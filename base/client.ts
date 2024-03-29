import {
  Client as BaseClient,
  ClientOptions,
  LocalAuth,
  Message,
  Contact,
  Chat,
} from "whatsapp-web.js";
import { cwd } from "process";

import fs from "fs/promises";
import { Command } from "../interfaces/command";

import { Event } from "../interfaces/event";

import { Collection } from "@discordjs/collection";
import Logger from "../Util/logger";
import { I18n } from "../i18n/classes/i18n";
import { connection } from "mongoose";
import { Config } from "../Util/config";
import Schemas from "../database/mongoose/schemas/export";
import { connect } from "../database/mongoose/index";

class Client extends BaseClient {
  public commands: Collection<string, Command> = new Collection();
  public i18n: I18n = new I18n({ path: `${cwd()}/i18n/locales` });
  public config: typeof Config = Config;
  public uptime: number = null;
  public cooldowns: Collection<
    string,
    { time: number; sent: boolean; count: number }
  > = new Collection();
  public path: string;
  public db: {
    connection: typeof connection;
    schemas: typeof Schemas;
  };
  constructor(options?: ClientOptions) {
    const defaultOptions: ClientOptions = {
      puppeteer: {
        executablePath:
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      },
      authStrategy: new LocalAuth(),
    };
    super(Object.assign(defaultOptions, options));
    this.commands = new Collection();

    this.path = cwd();
  }

  protected async registerEvents(dir: string, debug = false): Promise<boolean> {
    try {
      let path = `${this.path}\\${dir}\\`;
      let files = await fs.readdir(path);

      for (let file of files) {
        let stat = await fs.lstat(`${path}\\${file}`);
        if (stat.isDirectory()) {
          await this.registerEvents(`${dir}\\${file}`, debug);
        }
        if (file.endsWith(".ts")) {
          let { default: event } = (await import(`${path}\\${file}`)) as {
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
      let path = `${this.path}\\${dir}\\`;
      let files = await fs.readdir(path);

      for (let file of files) {
        let stat = await fs.lstat(`${path}\\${file}`);
        if (stat.isDirectory()) {
          await this.registerCommands(`${dir}\\${file}`, debug);
        } else if (file.endsWith(".ts")) {
          let { default: cmd } = (await import(`${path}\\${file}`)) as {
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
  protected async startDatabase(url: string) {
    try {
      this.db = await connect(url);
    } catch {
      this.db = null;
      console.log("Error connecting to database");
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
    await this.startDatabase(this.config.mongoUrl);
    await this.registerEvents(options.eventsDir, options.debug);
    await this.registerCommands(options.commandsDir, options.debug);
    await this.initialize();
  }

  public awaitMessage(options: {
    filter: (message: Message) => boolean;
    time: number;
  }): Promise<Message> {
    return new Promise<Message>((resolve, reject) => {
      setTimeout(() => {
        reject(null);
      }, options.time);
      this.on("message", (message: Message) => {
        if (options.filter(message)) {
          resolve(message);
        }
      });
    });
  }
}

export default Client;
export { Client };
