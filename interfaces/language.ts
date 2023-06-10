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
  commands: JsonCommand[];
  variables: Variable[];
}

export { JsonCommand, Variable, Reply, JsonLanguage };
