import axios from "axios";
import Global from "../Global";
import {
  addForwarded,
  axiosError2String,
  decodeToken,
  extractAuthProvider,
  extractToken,
  getMyIp,
} from "./utils";
import { NextFunction, Request, Response } from "express";

export async function tokenGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //   whitelist
  const whitePath = [...Global.whitelist_path.keys()];
  if (whitePath.some((p) => req.path.includes(p))) return next();

  //   provider
  const provider = extractAuthProvider(req);
  if (!provider)
    return res.status(401).json({ message: "can not extract auth provider" });

  try {
    // token
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: "no valid token" });
    const user = decodeToken(token);
    if (!user) return res.status(401).json({ message: "no valid token" });
    const userType = user.userType;

    if (provider === "*") {
      // no need auth
      req["user"] = user.payload;
      req["user"]._id = req["user"].id;
    } else {
      const { data } = await axios.post(
        provider,
        {
          userType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Forwarded-For": addForwarded(req, getMyIp()),
          },
        }
      );
      req["user"] = data.data;
    }
    req[userType] = req["user"];

    req["user"].id = req["user"]._id;
    req["authInfo"] = {
      from: provider === "*" ? null : provider,
    };
    return next();
  } catch (err) {
    // console.log(axiosError2String(err));
    return res
      .status(401)
      .json({ message: `unAuthorization , from ${provider} api` });
  }
}
