import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>) {}

  async getProfile(): Promise<Profile> {
    const profile = await this.profileModel.findOne().exec();
    if (!profile) {
      // For this mock app, we'll create a default profile if it doesn't exist
      return this.profileModel.create({
        name: 'John Doe',
        title: 'Project Manager',
        username: 'johndoe',
      });
    }
    return profile;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.profileModel.findOneAndUpdate({}, updateProfileDto, { new: true }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}
