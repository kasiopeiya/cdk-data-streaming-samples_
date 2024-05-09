import { Construct } from 'constructs'
import { Stream, type StreamProps, StreamMode } from 'aws-cdk-lib/aws-kinesis'
import * as ssm from 'aws-cdk-lib/aws-ssm'

interface MyDataStreamProps {
  stackName: string
  dataStreamProps?: StreamProps
}

export class MyDataStream extends Construct {
  public readonly dataStream: Stream

  constructor(scope: Construct, id: string, props: MyDataStreamProps) {
    super(scope, id)

    // Kinesis Data Streams
    this.dataStream = new Stream(this, 'Resource', {
      // shardCount: props.dataStreamProps?.shardCount ?? 1,
      streamMode: StreamMode.ON_DEMAND,
      ...props.dataStreamProps
    })

    // SSM Parameter Store
    new ssm.StringParameter(this, 'parameter', {
      parameterName: `/${props.stackName}/dataStreamName`,
      stringValue: this.dataStream.streamName
    })
  }
}
