import * as argon from 'argon2';

import { IMPORTS_KEY } from './types';

export const importsProviders = [
  {
    provide: IMPORTS_KEY.ARGON,
    useFactory: () => argon,
  },
];
