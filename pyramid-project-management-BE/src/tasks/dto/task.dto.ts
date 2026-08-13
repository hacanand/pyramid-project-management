import { IsOptional, IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  memberIds?: string[];

  @IsOptional()
  @IsArray()
  labels?: string[];

  @IsOptional()
  @IsString()
  reporterId?: string;
}

export class UpdateTaskDto extends CreateTaskDto {}

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  body: string;
}

export class CreateSubTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;
}
