import 'reflect-metadata';

export const DYNAMO_COLUMN_DEF = 'aws:dynamo:definition';

export function DynamoColumn(metadata: { type: string }): PropertyDecorator {
	return (target: Object, propertyKey: string) => {
		const allMetadata = (
			Reflect.getMetadata(DYNAMO_COLUMN_DEF, target)
			||
			{}
		);
		// Ensure allMetadata has propertyKey
		allMetadata[propertyKey] = (
			allMetadata[propertyKey]
			||
			{}
		);
		// Update the metadata with anything from updates
		// tslint:disable-next-line:forin
		for (const key of Reflect.ownKeys(metadata)) {
			allMetadata[propertyKey][key] = metadata[key];
		}
		// Update the metadata
		Reflect.defineMetadata(
			DYNAMO_COLUMN_DEF,
			allMetadata,
			target
		);
	};
}
