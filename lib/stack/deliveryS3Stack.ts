import { Duration, Stack, type StackProps } from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import { type Bucket } from 'aws-cdk-lib/aws-s3'
import * as kinesisfirehose_alpha from '@aws-cdk/aws-kinesisfirehose-alpha'
import * as kinesisfirehose_destination_alpha from '@aws-cdk/aws-kinesisfirehose-destinations-alpha'

import { MyDataStream } from '../construct/kds'
import { KdsCWDashboard } from '../construct/kdsCWDashboard'

interface DeliveryS3StackProps extends StackProps {
  prefix: string
  bucket: Bucket
}

/**
 * S3への配信構成
 */
export class DeliveryS3Stack extends Stack {
  constructor(scope: Construct, id: string, props: DeliveryS3StackProps) {
    super(scope, id, props)

    /*
    * Kinesis Data Streams
    -------------------------------------------------------------------------- */
    const myDataStream = new MyDataStream(this, 'DataStream', {
      parameterKeyName: '/firehoseS3/kds/dataStreamName'
    })

    /*
    * Data Firehose
    -------------------------------------------------------------------------- */
    const s3Destination = new kinesisfirehose_destination_alpha.S3Bucket(props.bucket, {
      bufferingInterval: Duration.seconds(60),
      dataOutputPrefix: 'data/!{timestamp:yyyy/MM/dd/HH}/',
      errorOutputPrefix: 'error/!{firehose:error-output-type}/!{timestamp:yyyy/MM/dd/HH}/'
    })

    const deliveryStream_ = new kinesisfirehose_alpha.DeliveryStream(this, 'SampleDeliveryStream', {
      destinations: [s3Destination],
      sourceStream: myDataStream.dataStream
    })

    /*
    * Monitoring
    -------------------------------------------------------------------------- */
    new KdsCWDashboard(this, 'KdsCWDashborad', {
      prefix: props.prefix,
      dataStream: myDataStream.dataStream,
      deliveryStream: deliveryStream_
    })
  }
}
