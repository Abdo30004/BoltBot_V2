interface Variable {
  key: string;
  values: string[];
}
interface Reply {
  key: string;
  value: string;
}
interface JsonCommand {
  name: string;
  description: string;
  usage: string;
  replies?: Reply[] | null;
}

interface JsonLanguage {
  code: string;
  commands: JsonCommand[];
  variables: Variable[];
  defaults: Reply[];
}
interface argument {
  key: string;
  value: any;
}
export { JsonCommand, Variable, Reply, JsonLanguage, argument };
