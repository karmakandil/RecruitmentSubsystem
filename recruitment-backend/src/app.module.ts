import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OnboardingModule } from './onboarding/onboarding.module';
import { RecruitmentModule } from './recruitment/recruitment.module';

@Module({
  imports: [
    // Read .env variables globally (MONGODB_URI, PORT, etc.)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Connect to MongoDB using env
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    // Feature modules
    OnboardingModule,
    RecruitmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}