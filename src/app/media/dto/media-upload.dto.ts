import { ApiModelProperty } from '@nestjs/swagger';

export class MediaMetadataDto {
	@ApiModelProperty()
	fieldname: string;

	@ApiModelProperty()
	originalname: string;

	@ApiModelProperty()
	encoding: string;

	@ApiModelProperty()
	mimetype: string;
}

export class MediaUploadDto {

	@ApiModelProperty()
	public fieldname: string;

	@ApiModelProperty()
	public originalname: string;

	@ApiModelProperty()
	public encoding: string;

	@ApiModelProperty()
	public mimetype: string;

	@ApiModelProperty()
	public size: number;

	@ApiModelProperty()
	public bucket: string;

	@ApiModelProperty()
	public key: string;

	@ApiModelProperty()
	public acl: string;

	@ApiModelProperty()
	public contentType: string;

	@ApiModelProperty()
	public contentDisposition: string;

	@ApiModelProperty()
	public storageClass: string;

	@ApiModelProperty()
	public serverSideEncryption: string;

	@ApiModelProperty()
	public metadata: MediaMetadataDto;

	@ApiModelProperty()
	location: string;

	@ApiModelProperty()
	etag: string;
}
