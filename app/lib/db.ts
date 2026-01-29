import { connect } from "mongoose";

let mongobdurl = process.env.MONGODB_URL;
if (!mongobdurl) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}
let cached = global.mongoose
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = connect(mongobdurl).then((m) => {
      return m.connection;
    });
  }
  try {
    cached.promise = await cached.promise;
  }
  catch (err) {
    throw err;
  }
  return cached.conn
}
export default connectDB;