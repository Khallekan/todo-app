import { Global, Module } from '@nestjs/common';

import { importsProviders } from './imports.providers';

@Global()
@Module({
  providers: [...importsProviders],
  exports: [...importsProviders],
})
export class ImportsModule {}
