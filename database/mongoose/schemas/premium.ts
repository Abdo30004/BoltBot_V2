import { Schema, model } from "mongoose";

export interface premium {
  _id: string;
  info: {
    startDate: Date;
    endDate: Date;
    days: number;
    code: string;
  };
}
const premiumSchema = new Schema<premium>(
  {
    _id: String,
    info: {
      startDate: Date,
      endDate: Date,
      days: Number,
      code: String,
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

let Premium = model("Premium", premiumSchema);

export default Premium;
export { Premium };
