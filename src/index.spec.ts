import {
  requireConfigKeys,
  requireConfigVars,
  Config,
  requireEnvVars,
  throwMissingConfigVars,
  throwMissingEnvVars,
} from './index';

let originalEnv: NodeJS.ProcessEnv;

describe('requireConfigKeys', () => {
  beforeAll(() => {
    // store the original env
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // reset to original env
    process.env = originalEnv;
  });

  it('should require a variable that has no default or is not nullable', () => {
    process.env = {};
    const config: Config = { UNDEFINED: process.env.UNDEFINED };
    const missingEnvVars = requireConfigKeys(config);
    expect(missingEnvVars).toHaveLength(1);
    expect(missingEnvVars).toContain('UNDEFINED');
  });

  it('should not require a variable that has a default specified', () => {
    process.env = {};
    const config: Config = {
      HAS_DEFAULT_VALUE: process.env.HAS_DEFAULT_VALUE || 'DEFAULT',
    };
    const missingEnvVars = requireConfigKeys(config);
    expect(missingEnvVars).toHaveLength(0);
    expect(missingEnvVars).not.toContain('HAS_DEFAULT_VALUE');
  });

  it('should not require a variable that is nullable', () => {
    process.env = {};
    const config: Config = {
      NULLABLE: process.env.NULLABLE || null,
    };
    const missingEnvVars = requireConfigKeys(config);
    expect(missingEnvVars).toHaveLength(0);
    expect(missingEnvVars).not.toContain('NULLABLE');
  });

  it('should return multiple undefined env vars', () => {
    process.env = {};
    const config: Config = {
      REQUIRED_1: process.env.REQUIRED_1,
      REQUIRED_2: process.env.REQUIRED_2,
    };
    const missingEnvVars = requireConfigKeys(config);
    expect(missingEnvVars).toHaveLength(2);
    expect(missingEnvVars).toContain('REQUIRED_1');
    expect(missingEnvVars).toContain('REQUIRED_2');
  });
  it('should not return anything if all are defined', () => {
    process.env = {
      REQUIRED_1: 'foo',
      REQUIRED_2: 'bar',
    };
    const config: Config = {
      REQUIRED_1: process.env.REQUIRED_1,
      REQUIRED_2: process.env.REQUIRED_2,
      FOO: 'baz',
    };
    const missingEnvVars = requireConfigKeys(config);
    expect(missingEnvVars).toHaveLength(0);
  });
  it('should allow objects', () => {
    process.env = {
      FOO: 'foo',
      BAR: 'bar',
    };
    const config: Config = {
      FOO: process.env.FOO as string,
      FOO2: process.env.FOO2 as string,
      NESTED: {
        BAR: process.env.BAR as string,
        BAR2: process.env.BAR2 as string,
      },
      BAZ: 'baz',
    };
    const missingEnvVars = requireConfigKeys(config);
    expect(missingEnvVars).toHaveLength(2);
    expect(missingEnvVars).toContain('FOO2');
    expect(missingEnvVars).toContain('BAR2');
  });
});

describe('requireConfigVars', () => {
  beforeAll(() => {
    // store the original env
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // reset to original env
    process.env = originalEnv;
  });

  it('should return a string array', () => {
    process.env = {};
    const config: Config = {
      REQUIRED_1: process.env.REQUIRED_1,
      REQUIRED_2: process.env.REQUIRED_2,
      FOO: process.env.FOO || 'foo',
      BAR: process.env.BAR || null,
    };
    const missingEnvVars = requireConfigVars(config);
    expect(missingEnvVars).toHaveLength(2);
    expect(missingEnvVars).toContain('REQUIRED_1');
    expect(missingEnvVars).toContain('REQUIRED_2');
  });

  it('should flatten the results from all configs to string array', () => {
    process.env = {};
    const config: Config = {
      REQUIRED_1: process.env.REQUIRED_1,
      REQUIRED_2: process.env.REQUIRED_2,
      FOO: process.env.FOO || 'foo',
      BAR: process.env.BAR || null,
    };
    const config2: Config = {
      FOO: process.env.FOO,
      BAR: process.env.BAR,
    };
    const missingEnvVars = requireConfigVars(config, config2);
    expect(missingEnvVars).toHaveLength(4);
    expect(missingEnvVars).toContain('REQUIRED_1');
    expect(missingEnvVars).toContain('REQUIRED_2');
    expect(missingEnvVars).toContain('FOO');
    expect(missingEnvVars).toContain('BAR');
  });

  it('should remove duplicates', () => {
    process.env = {};
    const config: Config = {
      FOO: process.env.FOO,
      BAR: process.env.BAR,
    };
    const config2: Config = {
      FOO: process.env.FOO,
      BAR: process.env.BAR,
    };
    const missingEnvVars = requireConfigVars(config, config2);
    expect(missingEnvVars).toHaveLength(2);
    expect(missingEnvVars).toContain('FOO');
    expect(missingEnvVars).toContain('BAR');
  });
});

describe('throwMissingConfigVars', () => {
  it('should throw if some variables are not in env', () => {
    process.env = {
      FOO: 'foo',
      BAR: 'bar',
    };
    const config: Config = {
      FOO: process.env.FOO as string,
      FOO2: process.env.FOO2 as string,
      NESTED: {
        BAR: process.env.BAR as string,
        BAR2: process.env.BAR2 as string,
      },
      BAZ: 'baz',
    };
    const testFn = () => {
      throwMissingConfigVars(config);
    };
    expect(testFn).toThrowError();
  });
});

describe('requireEnvVars', () => {
  it('should require env vars', () => {
    process.env = {
      FOO: 'foo',
    };
    const config: Config = {
      FOO: process.env.FOO,
      BAR: process.env.BAR,
    };
    const missingEnvVars = requireEnvVars(['FOO', 'BAR']);
    expect(missingEnvVars).toHaveLength(1);
    expect(missingEnvVars).toContain('BAR');
  });
});

describe('throwMissingEnvVars', () => {
  it('should throw required env vars', () => {
    process.env = {
      FOO: 'foo',
    };
    const config: Config = {
      FOO: process.env.FOO,
      BAR: process.env.BAR,
    };

    const testFn = () => {
      throwMissingEnvVars(['FOO', 'BAR']);
    };
    expect(testFn).toThrowError();
  });
});
