import { Client } from "./base/client";

let client = new Client();

client.start({
  commandsDir: "commands",
  eventsDir: "events",
  debug: true,
});
