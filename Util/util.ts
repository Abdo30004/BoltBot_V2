import { JsonLanguage, JsonCommand } from "../interfaces/language";
import chalk from "chalk";
interface options {
  equals: boolean;
  reason: string;
}
class Util {
  static compareObject(x: any, y: any): boolean {
    let obj1 = Object.entries(x);
    let obj2 = Object.entries(y);

    return this.compareArray(obj1, obj2);
  }

  static compareArray(x: any[], y: any[]): boolean {
    if (x.length !== y.length) {
      return false;
    }
    let equal = true;

    for (let i = 0; i < x.length; i++) {
      if (typeof x[i] !== typeof y[i]) {
        equal = false;
        break;
      }
      if (Array.isArray(x[i]) && Array.isArray(x[i])) {
        equal = this.compareArray(x[i], y[i]);
        continue;
      } else if (typeof x[i] === "object") {
        equal = this.compareObject(x[i], y[i]);
        continue;
      }

      equal = x[i] === y[i];
      if (!equal) {
        break;
      }
    }

    return equal;
  }
  static compareCommandLocales(
    Loc1Commands: JsonCommand[],
    Loc2Commands: JsonCommand[]
  ) {
    if (Loc1Commands.length !== Loc2Commands.length) {
      return {
        equal: false,
        reason: Loc1Commands.length > Loc2Commands.length ? "1>2" : "2<1",
      };
    }
    Loc1Commands = Loc1Commands.sort((a, b) => a.name.localeCompare(b.name));
    Loc2Commands = Loc2Commands.sort((a, b) => a.name.localeCompare(b.name));
    let equal = true;
    for (let i = 0; i < Loc1Commands.length; i++) {
      let cmd1 = Loc1Commands[i],
        cmd2 = Loc2Commands[i];
      equal =
        this.compareArray(
          Object.keys(cmd1).filter((c) => c != "replies"),
          Object.keys(cmd2).filter((c) => c != "replies")
        ) &&
        this.compareArray(
          cmd1.replies?.map((c) => c.key),
          cmd1.replies?.map((c) => c.key)
        );
    }
    return {
      equal,
      reason: "",
    };
  }

  static compareLocales(Loc1: JsonLanguage, Loc2: JsonLanguage) {}
}

console.log(
  Util.compareCommandLocales(
    [
      {
        description: "",
        name: "",
        usage: "",
      },
      {
        description: "",
        name: "",
        usage: "",
      },
    ],
    [
      {
        description: "",
        name: "",
        usage: "",
      },
      {
        description: "",
        name: "",
        usage: "",
      },
    ]
  )
);

export default Util;
export { Util };
