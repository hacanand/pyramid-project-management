import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './profile/schemas/profile.schema';
import { Member, MemberDocument } from './members/schemas/member.schema';
import { Project, ProjectDocument } from './projects/schemas/project.schema';
import { Task, TaskDocument } from './tasks/schemas/task.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async onModuleInit() {
    const profileCount = await this.profileModel.countDocuments();
    if (profileCount === 0) {
      await this.seedData();
    }
  }

  async seedData() {
    console.log('Seeding initial data...');

    // 1. Profile
    const profile = await this.profileModel.create({
      name: 'Dexter',
      title: 'Designer',
      username: 'Dexuser',
      email: 'Dexter@gmail.com',
    });
    
    // Create Profile ID alias to make relations easy to map to frontend's ID 'dexter'
    const dexId = profile._id.toString();

    // 2. Members
    const members = await this.memberModel.insertMany([
      { name: 'Dexter', initials: 'DX', avatar: '/avatars/dexter.png', role: 'Designer' },
      { name: 'Chris Nolan', initials: 'CN', role: 'Developer' },
      { name: 'Ankit Dutta', initials: 'AD', avatar: '/avatars/dexter.png', role: 'Designer' },
      { name: 'Admin', initials: 'AD', avatar: '/avatars/dexter.png', role: 'Admin' },
      { name: 'QA Team', initials: 'QA', avatar: '/avatars/dexter.png', role: 'QA' },
      { name: 'Designer', initials: 'DS', avatar: '/avatars/dexter.png', role: 'Designer' },
      { name: 'Security', initials: 'SE', avatar: '/avatars/dexter.png', role: 'Security' },
    ]);

    const adminId = members[3]._id.toString();
    const qaId = members[4]._id.toString();
    const designerId = members[5]._id.toString();
    const securityId = members[6]._id.toString();
    const chrisId = members[1]._id.toString();
    const ankitId = members[2]._id.toString();

    // 3. Projects
    const projects = await this.projectModel.insertMany([
      { name: 'Design Homepage', priority: 'high', leadId: dexId, dueDate: '12 Sep 2026' },
      { name: 'Develop Login Feature', priority: 'low', leadId: chrisId, dueDate: '15 Sep 2026' },
      { name: 'Test Payment Gateway', priority: 'medium', leadId: undefined, dueDate: '18 Sep 2026' },
    ]);

    const p1 = projects[0]._id.toString();
    const p2 = projects[1]._id.toString();
    const p3 = projects[2]._id.toString();

    // 4. Tasks
    await this.taskModel.insertMany([
      { title: 'Design Homepage', priority: 'high', status: 'todo', memberIds: [dexId], dueDate: '12 Sep 2026', labels: ['Design'], reporterId: dexId, projectId: p1 },
      { title: 'Develop Login Feature', priority: 'low', status: 'doing', memberIds: [chrisId], dueDate: '15 Sep 2026', labels: ['Development'], reporterId: dexId, projectId: p2 },
      { title: 'Test Payment Gateway', priority: 'medium', status: 'completed', memberIds: [], dueDate: '18 Sep 2026', labels: ['Testing'], reporterId: dexId, projectId: p3 },
      { title: 'Write API Documentation', description: 'Create clear API documentation.', priority: 'high', status: 'todo', memberIds: [adminId], dueDate: '29 Jul 2026', labels: ['Research', 'Design'], reporterId: dexId, subtasks: [{ title: 'Subtask 1', priority: 'high', memberIds: [dexId], dueDate: '12 Sep 2026' }], comments: [{ author: members[2], body: 'dsds', timestamp: 'just now' }] },
      { title: 'Feature Testing Passed', priority: 'high', status: 'completed', memberIds: [qaId], dueDate: '30 Jul 2026', labels: ['Testing', 'Passed'], reporterId: dexId },
      { title: 'UI Design Updated', priority: 'medium', status: 'completed', memberIds: [designerId], dueDate: '31 Jul 2026', labels: ['Design', 'Updated'], reporterId: dexId },
      { title: 'Security Audit Scheduled', priority: 'high', status: 'completed', memberIds: [securityId], dueDate: '01 Aug 2026', labels: ['Audit', 'Scheduled'], reporterId: dexId },
    ]);

    console.log('Seeding complete.');
  }
}
