import { networkInterfaces } from "os";
import { Request } from "express";
import { getEnv } from "../config/utils";
import jwt from "jsonwebtoken";

export function extractAuthProvider(req: Request) {
  const from = req.get("x-auth-from") || "nodeeweb.com";
  const provider = getEnv(`${from}-auth-provider`);
  return provider;
}

export function extractToken(req: Request) {
  return req.headers.authorization?.split("Bearer ")?.[1] ?? req.cookies?.auth;
}

export function decodeToken(
  token: string
): { userType: string } & { [k: string]: any } {
  const user = jwt.decode(token, { complete: true, json: true }) as any;
  if (!user) return;
  const userType =
    user.payload.type ?? (user.payload.role ?? "").split(":")?.[0];
  user.userType = userType;
  return user;
}

export function axiosError2String(error: any) {
  if (!error.isAxiosError) {
    return err2Str(error);
  }
  return JSON.stringify(
    {
      name: error.name,
      code: error.code,
      message: error.message,
      url: error?.request?._url || error?.config?.url,
      method: error.config?.method,
      res_data: error?.response?.data,
      req_data: error.config.data || error?.request?.data,
      res_headers: error?.response?.headers,
      req_headers: error?.config.headers,
      stack: error.stack,
    },
    null,
    "  "
  );
}

export function err2Str(error) {
  return convertToString(error);
}
export function convertToString(a, pretty = true) {
  try {
    //   if (a instanceof SimpleError)
    //     return `{ message : ${a.message} , stack : ${a.stack} }`;

    if (typeof a === "object") {
      const newA = {};
      Object.getOwnPropertyNames(a).forEach((key) => {
        newA[key] = a[key];
      });
      return !pretty ? JSON.stringify(newA) : JSON.stringify(newA, null, "  ");
    }
    return a?.toString() ?? String(a);
  } catch (err) {
    return `(convert failed because: ${err.message}) ${
      a?.toString() ?? String(a)
    }`;
  }
}

export function getMyIp(canInternal = false) {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && (canInternal || !net.internal)) {
        return net.address;
      }
    }
  }

  return null;
}

export function addForwarded(req: Request, ip: string) {
  const forwarded =
    (req.get("x-forwarded-for") ?? "").split(",").map((ip) => ip.trim()) ?? [];

  // push
  if (ip) forwarded.push(ip);

  return forwarded.join(",");
}
