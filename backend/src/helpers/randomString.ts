import crypto from "crypto";

export default function randomString() {
  return crypto.randomBytes(20).toString("hex");
}
