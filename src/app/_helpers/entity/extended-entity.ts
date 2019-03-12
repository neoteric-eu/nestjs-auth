export class ExtendedEntity {
	public id?: string;

	@ApiModelProperty()
	@attribute()
	public createdAt: string;

	@ApiModelProperty()
	@attribute()
	public updatedAt: string;
}
