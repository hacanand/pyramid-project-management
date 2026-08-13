import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto, CreateSubTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(status?: string, priority?: string, search?: string, projectId?: string): Promise<Task[]> {
    const filter: any = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (projectId) filter.projectId = projectId;
    if (search) filter.title = { $regex: search, $options: 'i' };
    
    return this.taskModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async addComment(id: string, createCommentDto: CreateCommentDto): Promise<any> {
    const task = await this.taskModel.findByIdAndUpdate(
      id,
      { $push: { comments: createCommentDto } },
      { new: true }
    ).exec();
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task.comments[task.comments.length - 1]; // Return the created comment
  }

  async addSubtask(id: string, createSubTaskDto: CreateSubTaskDto): Promise<any> {
    const task = await this.taskModel.findByIdAndUpdate(
      id,
      { $push: { subtasks: createSubTaskDto } },
      { new: true }
    ).exec();
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task.subtasks[task.subtasks.length - 1]; // Return the created subtask
  }
}
