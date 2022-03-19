import React, { useState, useEffect } from 'react'
import getCredentials from '../libs/aws-sts'

const AwsSwitchRole = () => {
  const [awsParameters, setAwsParameters] = useState({
    region: 'ap-northeast-1',
    accessKeyId: '',
    secretAccessKey: '',
    roleArn: '',
    serialNumber: '',
    durationSeconds: 900,
  })
  const [tokenCode, setTokenCode] = useState('')
  const [result, setResult] = useState([])

  useEffect(() => {
    const loadValue = localStorage.getItem('awsParameters')
    if (loadValue) {
      setAwsParameters(JSON.parse(loadValue))
    }
  }, [])

  const onClick = async (e) => {
    e.preventDefault()

    try {
      localStorage.setItem('awsParameters', JSON.stringify(awsParameters))
    } catch (err) {
      console.log(err)
    }

    try {
      const credentials = await getCredentials({
        ...awsParameters,
        tokenCode,
      })
      setResult([credentials.Credentials, ...result])
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <form>
        <p>
          AWS Region:
          <input
            name="region"
            type="text"
            value={awsParameters.region}
            onChange={(e) =>
              setAwsParameters({ ...awsParameters, region: e.target.value })
            }
          />
        </p>
        <p>
          AWS Access Key:
          <input
            name="accessKeyId"
            type="text"
            value={awsParameters.accessKeyId}
            onChange={(e) =>
              setAwsParameters({
                ...awsParameters,
                accessKeyId: e.target.value,
              })
            }
          />
        </p>
        <p>
          AWS Secret Key:
          <input
            name="secretAccessKey"
            type="text"
            value={awsParameters.secretAccessKey}
            onChange={(e) =>
              setAwsParameters({
                ...awsParameters,
                secretAccessKey: e.target.value,
              })
            }
          />
        </p>
        <p>
          TokenCode:
          <input
            name="tokenCode"
            type="text"
            value={tokenCode}
            onChange={(e) => setTokenCode(e.target.value)}
          />
        </p>
        <p>
          RoleArn:
          <input
            name="roleArn"
            type="text"
            value={awsParameters.roleArn}
            onChange={(e) =>
              setAwsParameters({ ...awsParameters, roleArn: e.target.value })
            }
          />
        </p>
        <p>
          SerialNumber:
          <input
            name="serialNumber"
            type="text"
            value={awsParameters.serialNumber}
            onChange={(e) =>
              setAwsParameters({
                ...awsParameters,
                serialNumber: e.target.value,
              })
            }
          />
        </p>
        <p>
          DurationSeconds:
          <input
            name="durationSeconds"
            type="text"
            value={awsParameters.durationSeconds}
            onChange={(e) =>
              setAwsParameters({
                ...awsParameters,
                durationSeconds: e.target.value,
              })
            }
          />
        </p>
        <p>
          <button onClick={onClick}>submit</button>
        </p>
      </form>
      <div>
        <h2>AWS temporary security credentials</h2>
        {result.map((value, index) => {
          return (
            <div key={index}>
              <p>AccessKeyId: {value.AccessKeyId}</p>
              <p>SecretAccessKey: {value.SecretAccessKey}</p>
              <p>SessionToken: {value.SessionToken}</p>
              <p>Expiration: {JSON.stringify(value.Expiration)}</p>
              <pre>
                {`
Linux 
export AWS_ACCESS_KEY_ID=`}
                {value.AccessKeyId}
                {`
export AWS_SECRET_ACCESS_KEY=`}
                {value.SecretAccessKey}
                {`
export AWS_DEFAULT_REGION=`}
                {awsParameters.region}
                {`

Windows (To set for all sessions)
setx AWS_ACCESS_KEY_ID `}
                {value.AccessKeyId}
                {`
setx AWS_SECRET_ACCESS_KEY `}
                {value.SecretAccessKey}
                {`
setx AWS_DEFAULT_REGION `}
                {awsParameters.region}
                {`
`}
              </pre>
              <hr />
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default AwsSwitchRole
