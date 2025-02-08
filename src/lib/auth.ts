import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function signToken(payload: object): string {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in the environment");
  }
  return jwt.sign(payload, secretKey, { expiresIn: "7d" });
}

export function verifyToken(token: string): string | object {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in the environment");
  }
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}
