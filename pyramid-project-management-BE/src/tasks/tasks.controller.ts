import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto, CreateSubTaskDto } from './dto/task.dto';
import { AuthGuard } from '../common/guards/auth/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.tasksService.findAll(status, priority, search, projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    return this.tasksService.addComment(id, createCommentDto);
  }

  @Post(':id/subtasks')
  addSubtask(@Param('id') id: string, @Body() createSubTaskDto: CreateSubTaskDto) {
    return this.tasksService.addSubtask(id, createSubTaskDto);
  }
}
