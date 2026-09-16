import crypto from "crypto";

/**
 * CCAvenue AES-128-CBC Encryption
 * Working Key (128-bit hex string) MD5 hashed -> 16 bytes key
 * IV is fixed 16 bytes: [0x00, 0x01, ..., 0x0f]
 */
export const ccavenueEncrypt = (plainText: string, workingKey: string): string => {
  const md5Key = crypto.createHash("md5").update(workingKey).digest();
  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
  ]);
  const cipher = crypto.createCipheriv("aes-128-cbc", md5Key, iv);
  let encoded = cipher.update(plainText, "utf8", "hex");
  encoded += cipher.final("hex");
  return encoded;
};

/**
 * CCAvenue AES-128-CBC Decryption
 */
export const ccavenueDecrypt = (encText: string, workingKey: string): string => {
  const md5Key = crypto.createHash("md5").update(workingKey).digest();
  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
  ]);
  const decipher = crypto.createDecipheriv("aes-128-cbc", md5Key, iv);
  let decoded = decipher.update(encText, "hex", "utf8");
  decoded += decipher.final("utf8");
  return decoded;
};

/**
 * Parse CCAvenue decrypted response query string (key=value&...) into an object
 */
export const parseCcavenueResponse = (decryptedStr: string): Record<string, string> => {
  const params = new URLSearchParams(decryptedStr);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};



