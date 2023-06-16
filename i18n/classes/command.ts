import { JsonCommand, Reply, argument } from "../../interfaces/language";
import { Config } from "../../Util/config";

class CommandLocal {
  public name: string;
  public description: string;
  public usage: string;
  public replies: Reply[] | null;
  public locale: string;
  constructor(cmd: JsonCommand, locale: string) {
    this.name = cmd.name;
    this.description = cmd.description;
    this.usage = `${Config.prefix}${cmd.name} ${cmd.usage || ""}`.trim();
    this.locale = locale;
    this.replies = cmd.replies || null;
  }

  private replaceArgs(str: string, args?: argument[]) {
    if (!args?.length) return str;

    return str.replace(/{{\S+}}/g, (match, number) => {
      let key = match.replace(/{{|}}/g, "");
      return args?.find((arg) => arg.key == key)
        ? args?.find((arg) => arg.key == key)?.value
        : match;
    });
  }
  public getReply(key: string, args?: argument[]) {
    if (!this.replies) return `no replies in (${this.locale}.${this.name})`;
    let reply = this.replies.find((r) => r.key === key);
    if (!reply)
      return `no reply found with this key (${this.locale}.${this.name}.${key})`;
    return this.replaceArgs(reply.value, args);
  }
}

export default CommandLocal;
export { CommandLocal };
