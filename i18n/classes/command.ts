import { JsonCommand, Reply } from "../../interfaces/language";

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
  public getReply(key: string) {
      if (!this.replies) return "";
      let reply = this.replies.find((r) => r.key === key);
        if (!reply) return "";
    return reply.value;
  }
}

export default CommandLocal;
export { CommandLocal };
