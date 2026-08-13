import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { MembersModule } from './members/members.module';
import { LabelsModule } from './labels/labels.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed.service';
import { Profile, ProfileSchema } from './profile/schemas/profile.schema';
import { Member, MemberSchema } from './members/schemas/member.schema';
import { Project, ProjectSchema } from './projects/schemas/project.schema';
import { Task, TaskSchema } from './tasks/schemas/task.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Member.name, schema: MemberSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
    CacheModule.register({ isGlobal: true, ttl: 60000, max: 100 }), // In-memory LRU cache
    ProfileModule, 
    MembersModule, 
    LabelsModule, 
    TasksModule, 
    ProjectsModule, 
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
