import qrterminal from "qrcode-terminal";
import { Event } from "../interfaces/event";

const event: Event = {
  name: "qr",
  once: false,
  run: async (client,qr) => {
    qrterminal.generate(qr, { small: true });
  },
};

export default event;
