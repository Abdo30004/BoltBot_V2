import { Command } from "../../interfaces/command";
import { uptime as processUptime } from "process";
import { uptime as systemUptime } from "os";
import moment from "moment-timezone";
import process from "process";
const command: Command = {
  name: "stats",
  aliases: ["botinfo", "uptime"],
  devOnly: true,
  category: "devs",
  execute: async (client, message, _translate, args) => {
    let blockCount = (await client.getBlockedContacts()).length;
    let chats = await client.getChats();
    let users = await client.getContacts();
    let reply = `*Bot's Stats*\n\nReady at: ${moment(client.uptime).format(
      "YYYY/MM/DD HH:mm:ss"
    )}\n\nProcess Uptime: ${moment
      .duration(processUptime() * 1000)
      .humanize()}\n\nSystem Uptime: ${moment
      .duration(systemUptime() * 1000)
      .humanize()}\n\nMemory Usage: ${Math.round(
      process.memoryUsage().heapUsed / 1024 / 1024
    )}MB\n\nCPU Usage: ${Math.round(
      process.cpuUsage().user / 1024 / 1024
    )}%\n\nUsers: ${users.length}\n\nChats: ${chats.length}\n\nGroups: ${
      chats.filter((chat) => chat.isGroup).length
    }Dms: ${chats.filter((chat) => !chat.isGroup).length}\n\nCommands: ${
      client.commands.size
    }\n\nBlocklist: ${blockCount}\n\nCommands: ${client.commands.size}`;

    await message.reply(reply);
    return true;
  },
};

export default command;
