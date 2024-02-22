import "./src/config";
import app from "./src/app";
import { getEnv } from "./src/config/utils";

const port = +(getEnv("port") ?? 3000);
const host = getEnv("host") ?? "127.0.0.1";

app.listen(port, host, () => {
  console.log(`Server Listening at http://${host}:${port}`);
});
