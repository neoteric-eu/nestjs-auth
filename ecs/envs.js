const fs = require('fs');
const AWS = require('aws-sdk');

const envs = fs.readFileSync(`${__dirname}/../.env`, 'utf8');

AWS.config.update({
	region: 'us-east-2'
});
const ssm = new AWS.SSM();

const keyId = process.argv.slice(2)[0];

if (!keyId) {
	// https://aws.amazon.com/blogs/compute/managing-secrets-for-amazon-ecs-applications-using-parameter-store-and-iam-roles-for-tasks/
	console.error('Missing KeyId as argument for decryption');
	process.exit(1);
}
console.log(envs);
for (const line of envs.split('\n')) {
	if (!line) continue;
	const [key, val] = line.split('=');
	const isSecret = key.indexOf('SECRET') !== -1;
	const params = {
		Name: `/dev/threeleaf/${key.toLocaleLowerCase()}`,
		Type: isSecret ?  'SecureString' : 'String',
		Value: val,
		Overwrite: true
	};
	if (isSecret) {
		params.KeyId = keyId;
	}
	console.log(params);
	ssm.putParameter(params, (err, data) => {
		if (err) {
			console.error(err);
		} else {
			console.log(data);
		}
	});
}

