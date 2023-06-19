import { Schema, model } from "mongoose";

export interface user {
  _id: string;
  settings: {
    language: string;
  };
}
const userSchema = new Schema<user>(
  {
    _id: String,
    settings: {
      settings: String,
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

let User = model("User", userSchema);

export default User;
export { User };
