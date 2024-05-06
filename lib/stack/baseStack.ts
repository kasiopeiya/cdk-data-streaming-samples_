import { Stack, type StackProps, RemovalPolicy } from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'

/**
 * ステートフルなリソースを構築する
 */
export class BaseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    /*
    * S3
    -------------------------------------------------------------------------- */
    new s3.Bucket(this, 'Bucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true
    })
  }
}
