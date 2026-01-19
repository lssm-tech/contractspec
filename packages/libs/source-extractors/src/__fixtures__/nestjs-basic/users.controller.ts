/**
 * Fixture: Basic NestJS Controller
 *
 * A minimal NestJS controller for testing extraction.
 */

import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IsString, IsNumber, IsOptional } from 'class-validator';

/**
 * DTO for creating a user.
 */
export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}

/**
 * DTO for user query parameters.
 */
export class GetUsersQueryDto {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;
}

/**
 * User response shape.
 */
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
}

@Controller('users')
export class UsersController {
  @Get()
  async getUsers(@Query() _query: GetUsersQueryDto): Promise<UserResponse[]> {
    // Handler implementation
    return [];
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponse> {
    // Handler implementation
    return { id, name: '', email: '', createdAt: new Date() };
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponse> {
    // Handler implementation
    return { id: 'new-id', ...dto, createdAt: new Date() };
  }
}
