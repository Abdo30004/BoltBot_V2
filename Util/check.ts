import { JsonLanguage } from "../interfaces/language";
import chalk from "chalk";

function compareLocales(
  referenceLocale: JsonLanguage,
  locales: JsonLanguage[]
): void {
  const missingCommands: string[] = [];
  const missingVariables: string[] = [];
  const missingReplies: string[] = [];
  const missingDefaults: string[] = [];

  referenceLocale.commands.forEach((command) => {
    const commandName = command.name;

    // Check if command is missing in any locale
    const missingInLocales = locales.filter((locale) => {
      const matchingCommand = locale.commands.find(
        (cmd) => cmd.name === commandName
      );
      return !matchingCommand;
    });

    if (missingInLocales.length > 0) {
      missingInLocales.forEach((locale) => {
        missingCommands.push(`${locale.code}.${commandName}`);
      });
    }

    // Check if reply keys are missing in any locale
    command.replies?.forEach((reply) => {
      const replyKey = reply.key;

      const missingReplyInLocales = locales.filter((locale) => {
        const matchingCommand = locale.commands.find(
          (cmd) => cmd.name === commandName
        );
        const matchingReply = matchingCommand?.replies?.find(
          (r) => r.key === replyKey
        );
        return !matchingReply;
      });

      if (missingReplyInLocales.length > 0) {
        missingReplyInLocales.forEach((locale) => {
          missingReplies.push(`${locale.code}.${commandName}.${replyKey}`);
        });
      }
    });
  });

  // Check missing variables
  referenceLocale.variables.forEach((variable) => {
    const variableKey = variable.key;

    const missingVariableInLocales = locales.filter((locale) => {
      const matchingVariable = locale.variables.find(
        (v) => v.key === variableKey
      );
      return !matchingVariable;
    });

    if (missingVariableInLocales.length > 0) {
      missingVariableInLocales.forEach((locale) => {
        missingVariables.push(`${locale.code}.${variableKey}`);
      });
    }
  });

  // Check missing defaults
  referenceLocale.defaults.forEach((defaultReply) => {
    const defaultReplyKey = defaultReply.key;

    const missingDefaultInLocales = locales.filter((locale) => {
      const matchingDefault = locale.defaults.find(
        (reply) => reply.key === defaultReplyKey
      );
      return !matchingDefault;
    });

    if (missingDefaultInLocales.length > 0) {
      missingDefaultInLocales.forEach((locale) => {
        missingDefaults.push(`${locale.code}.${defaultReplyKey}`);
      });
    }
  });

  // Print missing keys
  console.log(chalk.yellow("Missing commands:"));
  if (missingCommands.length === 0) {
    console.log(chalk.green("None"));
  } else {
    console.log(chalk.red(missingCommands.join(", ")));
  }

  console.log(chalk.yellow("\nMissing variables:"));
  if (missingVariables.length === 0) {
    console.log(chalk.green("None"));
  } else {
    console.log(chalk.red(missingVariables.join(", ")));
  }

  console.log(chalk.yellow("\nMissing replies:"));
  if (missingReplies.length === 0) {
    console.log(chalk.green("None"));
  } else {
    console.log(chalk.red(missingReplies.join(", ")));
  }

  console.log(chalk.yellow("\nMissing defaults:"));
  if (missingDefaults.length === 0) {
    console.log(chalk.green("None"));
  } else {
    console.log(chalk.red(missingDefaults.join(", ")));
  }
}

export default compareLocales;
export { compareLocales };
