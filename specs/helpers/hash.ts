import * as crypto from "crypto";

export const hash = (data: Buffer) => {
  const md5 = crypto.createHash('md5');
  md5.update(data);
  return md5.digest('hex');
}
