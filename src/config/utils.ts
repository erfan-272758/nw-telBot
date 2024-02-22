export function getEnv(key: string) {
  key = key.toUpperCase().replace(/-|\./g, "_");
  return process.env[key];
}
