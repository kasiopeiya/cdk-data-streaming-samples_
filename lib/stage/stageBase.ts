import { type Stack, Stage } from 'aws-cdk-lib'
import { type Construct } from 'constructs'

import { type Config } from '../../config'
import { BaseStack } from '../stack/baseStack'

export abstract class StageBase extends Stage {
  createCommonStacks(scope: Construct, config: Config): Record<string, Stack> {
    const prefix: string = config.prefix
    const env = config.env

    const baseStack = new BaseStack(scope, `${prefix}-base-stack`, { env })

    return {
      baseStack
    }
  }
}
