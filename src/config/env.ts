import { config } from "dotenv";

const loader = process.env.ENV_LOADER;
if (!loader || loader === "null") config({ path: ".env.local" });
