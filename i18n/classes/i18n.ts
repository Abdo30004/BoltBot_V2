import fs from "fs/promises";
import { Language } from "./language";
import { Collection } from "@discordjs/collection";
import { compareLocales } from "../../Util/check";
import { argument } from "../../interfaces/language";
class I18n {
  public languages: Collection<string, Language>;
  public locales: string[];

  constructor(config: { path: string }) {
    this.languages = new Collection();
    this.init(config.path).then(() => {
      compareLocales(
        this.languages.get("en").json,
        this.languages.map((l) => l.json)
      );
    });
  }

  async init(path: string) {
    try {
      let locales = (await fs.readdir(path)).filter((f) => f.endsWith(".json"));
      for (let locale of locales) {
        let id = locale.split(".")[0];
        let language = new Language({ id, path: `${path}/${locale}` });
        this.languages.set(id, language);
      }
      this.locales = locales.map((l) => l.split(".")[0]);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public getLanguage(id: string) {
    return this.languages.get(id) || null;
  }

  public getCommand(id: string, name: string) {
    let language = this.getLanguage(id);
    if (!language) return null;
    return language.getCommand(name);
  }
  public getDefault(id: string, key: string, args?: argument[]) {
    let language = this.getLanguage(id);
    if (!language) return null;
    return language.getDefault(key, args);
  }
}

export default I18n;
export { I18n };
