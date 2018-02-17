import { requireConfigVars } from './index';

let originalEnv: NodeJS.ProcessEnv;

describe('baseRequire', () => {
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
    const missingEnvVars = requireConfigVars({ FOO: process.env.FOO });
    expect(missingEnvVars).toHaveLength(1);
    expect(missingEnvVars).toContainEqual('FOO');
  });
  it('should not require a variable that has a default specified');
  it('should not require a variable that is nullable');
});
