import {Body, Delete, Get, Param, Patch, Post, Put, Req} from '@nestjs/common';
import {DeepPartial} from 'typeorm';
import {CrudService} from './crud.service';
import {ExtendedEntity} from '../app/_helpers';

export class RestController<T extends ExtendedEntity> {
	protected service: CrudService<T>;

	@Get('/')
	public findAll(@Req() req): Promise<T[]> {
		return this.service.findAll();
	}

	@Get('/:id')
	public async findOne(@Param('id') id: string) {
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
	public async patch(@Param('id') id: string, @Body() data: DeepPartial<T>): Promise<T> {
		return this.service.patch(id, data);
	}

	@Delete('/:id')
	public async delete(@Param('id') id: string): Promise<T> {
		return this.service.delete(id);
	}
}
