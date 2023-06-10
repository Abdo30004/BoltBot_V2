import { JsonLanguage, JsonCommand } from "../../interfaces/language";
import fs from "fs/promises";
import { CommandLocal } from "./command";

class Language {
  public id: string;
  public json: JsonLanguage | null;
  constructor(options: { id: string; path: string }) {
    this.id = options.id;
    this.json = null;
    this.load(options.path);
  }
  private async load(path: string) {
    try {
      const jsons = await fs.readFile(path, "utf-8");
      this.json = JSON.parse(jsons);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  private randomize(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  private replace(str: string) {

    return str.replace(/{{\S+}}/g, (match) => {
      let key = match.replace(/{{|}}/g, "");

      let variable = this.getVariable(key);
      if (!variable) return match;

      return this.randomize(variable.values);
    });
  }

  private replaceAllStrings(cmd: JsonCommand) {
    if (!cmd) return null;
    let replacedCmd = {
      name: cmd.name,
      description: this.replace(cmd.description),
      usage: this.replace(cmd.usage),
      replies: cmd.replies?.map((r) => ({
        key: r.key,
        value: this.replace(r.value),
      })),
    };

    return replacedCmd;
  }
  public getVariable(key: string) {
    if (!this.json) return null;

    return this.json.variables.find((v) => v.key === key) || null;
  }
  public getCommand(name: string) {
    if (!this.json) return null;
    let command = this.json.commands.find((c) => c.name === name) || null;
    if (!command) return null;

    let replacedCmd = this.replaceAllStrings(command);
    if (!replacedCmd) return null;
    return new CommandLocal(replacedCmd);
  }
}

export default Language;
export { Language };
