export interface Config {
  [key: string]: string | null | Config;
}

export const requireConfigKeys = (config: Config) => {
  const missingEnvVars: string[] = [];
  Object.keys(config).forEach(key => {
    // Allow null values
    if (process.env[key] === undefined && config[key] !== null) {
      // Allow nested config objects
      if (typeof config[key] === 'object') {
        missingEnvVars.push(...requireConfigKeys(config[key] as Config));
      } else if (typeof config[key] !== 'string') {
        // Allow config keys with a default value
        missingEnvVars.push(key);
      }
    }
  });

  return missingEnvVars;
};

const unique = <T>(arr: T[]) => Array.from(new Set(arr));

export const requireConfigVars = (...configs: Config[]): string[] => {
  return unique(
    configs.map(requireConfigKeys).reduce((acc, arr) => acc.concat(arr)),
  );
};

export default requireConfigVars;
