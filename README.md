# STOP EC2 INSTANCES
## Using a simple lambda function
Setting up thi simple Lambda funciotn you can stop all your maachines running in a test Environment when you leave office, preventing your company from spending money for running instances in non-working hours.

The lambda function is very simple and runs only for the region you're it is running from, you can even specify regions by confuring the SDK as desired.

As we are not providing any credential you will have to set up the right permissions in the lambda role, to do this you can assign your lambda a policy like the following:
    
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ],
          "Resource": "arn:aws:logs:*:*:*"
        },{
                "Sid": "Stmt1444812758000",
                "Effect": "Allow",
                "Action": [
                    "ec2:DescribeInstanceStatus",
                    "ec2:DescribeInstances",
                    "ec2:StartInstances",
                    "ec2:StopInstances"
                ],
                "Resource": [
                    "*"
                ]
            }
      ]
    }

You can trigger the lambda function using cloudwatch events, for further documentation refer to the links tha follow.

http://docs.aws.amazon.com/lambda/latest/dg/intro-core-components.html
http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/WhatIsCloudWatchEvents.html
