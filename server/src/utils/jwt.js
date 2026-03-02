import jwt from "jsonwebtoken";

export function signToken(user) {
  const role = user.role || "user";
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
    role
  };
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.verify(token, secret);
}
