import {BaseEntity, DeleteResult, DeepPartial} from 'typeorm';
import {Body, Delete, Get, Param, ParseIntPipe, Patch, Post, Put} from '@nestjs/common';
import {CrudService} from './crud.service';

export class RestController<T extends BaseEntity> {
	protected service: CrudService<T>;

	@Get('/')
	public async findAll(): Promise<T[]> {
		return this.service.findAll();
	}

	@Get('/:id')
	public async findOne(@Param('id', new ParseIntPipe()) id: number) {
		return this.service.findOneById(id);
	}

	@Post('/')
	public async create(@Body() data: DeepPartial<T>): Promise<T> {
		return this.service.create(data);
	}

	@Put('/:id')
	public async update(@Body() data: DeepPartial<T>): Promise<T> {
		return this.service.update(data);
	}

	@Patch('/:id')
	public async patch(@Param('id', new ParseIntPipe()) id: number, @Body() data: DeepPartial<T>): Promise<T> {
		return this.service.patch(id, data);
	}

	@Delete('/:id')
	public async delete(@Param('id') id: number): Promise<DeleteResult> {
		return this.service.delete(id);
	}
}
