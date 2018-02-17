export interface Config {
  [key: string]: string | null;
}

export const requireConfigVars = (config: Config) => {
  const missingEnvVars: string[] = [];
  Object.keys(config).forEach(key => {
    if (!process.env[key]) missingEnvVars.push(key);
  });
  return missingEnvVars;
};

export const baseRequire = (...config: Config[]) => {};

export default requireConfigVars;
