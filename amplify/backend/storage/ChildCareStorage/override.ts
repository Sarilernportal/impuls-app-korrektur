import { AmplifyS3ResourceTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyS3ResourceTemplate) {
  resources.addCfnResource({
    "type": "AWS::IAM::Policy",
    "properties": {
      "PolicyName": "Admin-Private-Access",
      "PolicyDocument": {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": "s3:GetObject",
            "Effect": "Allow",
            "Resource": {
              "Fn::Join": [
                "",
                [
                  "arn:aws:s3:::",
                  {
                    "Ref": "S3Bucket"
                  }
                ]
              ]
            }
          }
        ]
      },
      "Roles": [
        {
          "Fn::Join": [
            "",
            [
              {
                "Ref": "authChildCareAuthUserPoolId"
              },
              "-AdminGroupRole"
            ]
          ]
        }
      ]
    }
  }, "AdminPrivateAccess")
  // for s3 path https://github.com/aws-amplify/amplify-js/issues/54#issuecomment-876455852 "s3:PutObject"
  resources.addCfnResource({
    "type": "AWS::IAM::Policy",
    "properties": {
      "PolicyName": "S3-Download-Route",
      "PolicyDocument": {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": "s3:GetObject",
            "Condition": {
              "StringLike": {
                "s3:prefix": [
                  "private/${aws:PrincipalTag/username}/",
                  "private/${aws:PrincipalTag/username}/*"
                ]
              }
            },
            "Effect": "Allow",
            "Resource": {
              "Fn::Join": [
                "",
                [
                  "arn:aws:s3:::",
                  {
                    "Ref": "S3Bucket"
                  }
                ]
              ]
            }
          }
        ]
      },
      "Roles": [
        {
          "Fn::Join": [
            "",
            [
              {
                "Ref": "authChildCareAuthUserPoolId"
              },
              "-GuardianGroupRole"
            ]
          ]
        }
      ]
    }
  }, "S3DownloadRoute")
}
