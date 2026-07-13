import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * DynamoDB Table – Scores
     *
     * Schema:
     *   PK  userId  (STRING)  – unique player identifier (e.g. Google sub or generated UUID)
     *   SK  playedAt (STRING) – ISO timestamp of the game session
     *
     * Extra attributes stored per item:
     *   email    – player e-mail
     *   score    – numeric score achieved
     *   timeMs   – elapsed time in milliseconds
     *
     * GSI "ScoreIndex" lets you query the top scores across all players.
     */
    const table = new dynamodb.Table(this, 'CacaoDataTable', {
      tableName: 'CacaoData',
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // keep data safe on `cdk destroy`
    });

    // GSI: query/sort entries (e.g. leaderboard)
    table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {
        name: 'GSI1PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI1SK',
        type: dynamodb.AttributeType.NUMBER,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });


    /**
     * Lambda – Save Score
     */
    const handler = new lambdaNodejs.NodejsFunction(this, 'ScoresLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: 'lambda/src/index.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: table.tableName,
        SENDER_EMAIL: process.env.SENDER_EMAIL!,
      },
      bundling: {
        // @aws-sdk/* v3 is included in the Lambda Node.js 20 runtime,
        // so we mark it external to keep the bundle small and avoid
        // "Cannot find module" errors during local type-checking.
        externalModules: ['@aws-sdk/*'],
      },
    });


    /**
     * Permission Lambda -> DynamoDB and SES
     */
    table.grantReadWriteData(handler);

    handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'], // In production, restrict to specific verified identities
    }));

    /**
     * Lambda Function URL (public, no auth)
     */
    const functionUrl = handler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.POST, lambda.HttpMethod.GET],
        allowedHeaders: ['*'],
      },
    });


    /**
     * Outputs
     */
    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: functionUrl.url,
      description: 'Lambda Function URL – use for POST /scores and GET /scores',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
      description: 'DynamoDB table that stores scores',
    });
  }
}