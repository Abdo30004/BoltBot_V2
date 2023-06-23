import Client from "../base/client";
import { Event } from "../interfaces/event";
async function updateCache(client: Client) {
  let chats = await client.getChats();
  let users = await client.getContacts();
  let blocks = await client.getBlockedContacts();

  chats.forEach((chat) => {
    client.cache.chats.set(chat.id._serialized, chat);
  });

  users.forEach((user) => {
    client.cache.users.set(user.id._serialized, user);
  });
  client.cache.blocks = blocks.map((block) => block.id._serialized);
}

const event: Event = {
  name: "ready",
  once: false,
  run: async (client: Client) => {
    client.uptime = Date.now();
    updateCache(client);
    setInterval(() => {
      updateCache(client);
    }, 1000 * 60 * 60 * 2);
    console.log(`Logged in as ${client.info.pushname}`);
    client
      .sendMessage(client.config.test, "*Bolt Bot* ⚡ Started 🟢")
      .catch(() => null);
  },
};

export default event;
