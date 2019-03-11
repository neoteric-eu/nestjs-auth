import {ApiModelProperty} from '@nestjs/swagger';

export class ConvertTemplateDto {

	@ApiModelProperty()
	public template: string;

	@ApiModelProperty()
	public mainMedia: string;

	@ApiModelProperty()
	public firstMedia: string;

	@ApiModelProperty()
	public secondMedia: string;

	@ApiModelProperty()
	public thirdMedia: string;
}
