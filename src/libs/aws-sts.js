import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts'

const getCredentials = async ({
  region,
  accessKeyId,
  secretAccessKey,
  tokenCode,
  roleArn,
  serialNumber,
  durationSeconds,
}) => {
  const client = new STSClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
  const params = {
    RoleArn: roleArn,
    SerialNumber: serialNumber,
    TokenCode: tokenCode,
    RoleSessionName: new Date().getTime().toString(),
    DurationSeconds: durationSeconds,
  }
  const command = new AssumeRoleCommand(params)
  return client.send(command)
}

export default getCredentials
