import mongoose from "mongoose";
import Schemas from "./schemas/export";
const connect = async (url: string)=>{
 let db = await mongoose.connect(url, {
    dbName: "BoltBot",
  });
  return {
    connection: db.connection,
    schemas: Schemas,
  };
};

export default connect;
export { connect };
