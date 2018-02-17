# require-env-vars

A micro-module to ensure your Node process env has all the necessary variables to run your app.

## Features

* Check your config object for missing env variables
* Make some config keys optional
* Default values for keys
* Nested objects in config
* Multiple configuration files supported

## Example usage

`src/config/index.ts`

```javascript
const config = {
  NODE_ENV: process.env.NODE_ENV as string,
  API_KEY: process.env.API_KEY as string,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info', // A value with default
  LOG_FILE: process.env.LOG_FILE || null, // Maybe value
  PRE_DEFINED_VAR: 'foobar',
  // Nested object
  FOOBAR: {
    URL: process.env.FOOBAR_URL as string,
    API_KEY: process.env.FOOBAR_API_KEY as string,
  }
};
```

`src/index.ts`

```javascript
import { requireConfigVars } from '@jazmon/require-env-vars';
import config from './config';

const missingConfigVars = requireConfigVars(config);
if (missingConfigVars.length > 0) {
  throw new Error(
    `Required configuration variables are missing! ${JSON.stringify(
      missingConfigVars,
    )}`,
  );
  process.exit(2);
}

// ... app logic
```

### Directly throw if an error

```javascript
import { throwMissingConfigVars } from '@jazmon/require-env-vars';
import config from './config';
// You can pass multiple config files
import fooConfig from './config/foo';

try {
  throwMissingConfigVars(config, fooConfig);
} catch (err) {
  console.error(err);
  process.exit(2);
}
```

## Example usage to require strings

Or you can use the `requireEnvVars` which will take an array of strings as input to check env against:

```javascript
import { requireEnvVars } from '@jazmon/require-env-vars';

const missingEnvVars = requireEnvVars(['API_KEY', 'API_URL']);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Required configuration variables are missing! ${JSON.stringify(
      missingEnvVars,
    )}`,
  );
  process.exit(2);
}
```

### Directly throw if an error for string array

```javascript
import { throwMissingEnvVars } from '@jazmon/require-env-vars';
try {
  throwMissingEnvVars(['API_KEY', 'API_URL']);
} catch (err) {
  console.error(err);
  process.exit(2);
}
```
