import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "crypto";

const VERSION = "v1";
const ALGORITHM = "aes-256-gcm";

function encryptionKey() {
  const secret =
    process.env.TOKEN_ENCRYPTION_KEY ?? process.env.GOOGLE_CLIENT_SECRET;

  if (!secret) {
    throw new Error(
      "TOKEN_ENCRYPTION_KEY or GOOGLE_CLIENT_SECRET is required for integration tokens",
    );
  }

  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, encryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    VERSION,
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptSecret(value: string | null | undefined) {
  if (!value) return null;
  if (!value.startsWith(`${VERSION}.`)) return value;

  const [, ivValue, tagValue, ciphertextValue] = value.split(".");
  if (!ivValue || !tagValue || !ciphertextValue) {
    throw new Error("Invalid encrypted secret");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    encryptionKey(),
    Buffer.from(ivValue, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function signState(value: string) {
  const signature = createHash("sha256")
    .update(`${value}:${encryptionKey().toString("base64url")}`)
    .digest("base64url");
  return `${Buffer.from(value).toString("base64url")}.${signature}`;
}

export function verifyState(signedValue: string) {
  const [encoded, actualSignature] = signedValue.split(".");
  if (!encoded || !actualSignature) return null;

  const value = Buffer.from(encoded, "base64url").toString("utf8");
  const expected = signState(value).split(".")[1];
  const actualBuffer = Buffer.from(actualSignature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  return value;
}
