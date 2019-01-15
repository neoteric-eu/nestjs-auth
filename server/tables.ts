import AWS from 'aws-sdk';
import {config} from '../src/config';
// Set the region
AWS.config.update({region: 'local'});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({endpoint: 'http://localhost:8000'});

const params = {
	AttributeDefinitions: [
		{
			AttributeName: 'name',
			AttributeType: 'S'
		},
		{
			AttributeName: 'email',
			AttributeType: 'S'
		},
		{
			AttributeName: 'provider',
			AttributeType: 'S'
		},
		{
			AttributeName: 'socialId',
			AttributeType: 'S'
		},
		{
			AttributeName: 'password',
			AttributeType: 'S'
		},
		{
			AttributeName: 'cratedAt',
			AttributeType: 'S'
		},
		{
			AttributeName: 'updatedAt',
			AttributeType: 'S'
		}
	],
	KeySchema: [
		{
			AttributeName: 'email',
			KeyType: 'HASH'
		},
		{
			AttributeName: 'cratedAt',
			KeyType: 'RANGE'
		}
	],
	ProvisionedThroughput: {
		ReadCapacityUnits: 5,
		WriteCapacityUnits: 5
	},
	TableName: `${config.name}_users`,
	StreamSpecification: {
		StreamEnabled: false
	}
};

// Call DynamoDB to delete the specified table
ddb.createTable(params, function(err, data) {
	if (err && err.code === 'ResourceNotFoundException') {
		console.log('Error: Table not found');
	} else if (err && err.code === 'ResourceInUseException') {
		console.log('Error: Table in use');
	} else {
		console.log('Success', data);
	}
});
