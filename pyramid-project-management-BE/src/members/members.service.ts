import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './schemas/member.schema';

@Injectable()
export class MembersService {
  constructor(@InjectModel(Member.name) private memberModel: Model<MemberDocument>) {}

  async getMembers(): Promise<Member[]> {
    let members = await this.memberModel.find().exec();
    if (members.length === 0) {
      // Seed some mock members if empty
      members = await this.memberModel.insertMany([
        { name: 'Alice Smith', role: 'Developer', avatarUrl: '' },
        { name: 'Bob Jones', role: 'Designer', avatarUrl: '' },
      ]);
    }
    return members;
  }
}
