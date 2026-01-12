import { Module } from '@nestjs/common';
import { ObjectStorageService } from './object-storage.service';

@Module({
  providers: [ObjectStorageService],
  exports: [ObjectStorageService],
})
export class ObjectStorageModule {}
