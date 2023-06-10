import { JsonCommand, Reply } from "../../interfaces/language";
interface argument {
  key: string;
  value: any;
}

class CommandLocal {
  public name: string;
  public description: string;
  public usage: string;
  public replies: Reply[] | null;
  constructor(cmd: JsonCommand) {
    this.name = cmd.name;
    this.description = cmd.description;
    this.usage = cmd.usage;
    this.replies = cmd.replies || null;
  }

  private replaceArgs(str: string, args?: argument[]) {
    return str.replace(/{(\d+)}/g, (match, number) => {
      let key = match.replace(/{{|}}/g, "");
      return args?.find((arg) => arg.key == key)
        ? args?.find((arg) => arg.key == key)?.value
        : match;
    });
  }
  public getReply(key: string, args?: argument[]) {
    if (!this.replies) return "";
    let reply = this.replies.find((r) => r.key === key);
    if (!reply) return "";
    return this.replaceArgs(reply.value, args);
  }
}

export default CommandLocal;
export { CommandLocal };
