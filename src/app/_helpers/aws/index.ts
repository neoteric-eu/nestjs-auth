import AWS from 'aws-sdk';

export async function createTableIfNotExists<T>(dynamo: AWS.DynamoDB, entity: new () => T): Promise<void> {
	const tables = await dynamo.listTables().promise();
	if (!tables || !tables.TableNames || tables.TableNames.indexOf(entity.constructor.name) === -1) {
		await dynamo.createTable(entity.prototype).promise();
	}
}
