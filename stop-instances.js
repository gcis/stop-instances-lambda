// SIMPLE FUNCTION TO STOP ALL RUNNING VMS
// As we are using the AWS sdk without providing configuration
// the lambda function must have the right role to access resources
// and it will run only for on local region

var aws = require('aws-sdk');
exports.handler = (event, context) => {

    var ec2 = new aws.EC2();
    
    // The params object for the ec2.stopInstances is described at 
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#stopInstances-property
    var toStop = {
        InstanceIds: []
    };
    
    // Function that stops instances. 
    // As parameter takes an array of objects passed from the ec2.describeInstances method
    var stopInstances = (toStop) => {
        
        ec2.stopInstances(toStop, function(err, data) {
            if (err) {
                console.log(err);
                context.fail(err); // if any error occurs the lambda will fail logging the error
            } else {
                context.succeed(data) // in case of success lambda will succeed and return an object describing stopped instances
            }
        });
    }
    
    // First of all we launch de ec2.describeInstances command to get a list of running istances
    ec2.describeInstances((err, data) => {
        if (err) {
            console.log(err);
            context.fail(err); // if any error occurs the lambda will fail logging the error
        } else {
            // lets polulate the toStop object with each instance in each reservation
            data.Reservations.forEach((reservation) => {
                reservation.Instances.forEach((instance) => {
                    if (instance.State.Name != 'terminated') toStop.InstanceIds.push(instance.InstanceId);
                });
            });
            stopInstances(toStop);
        }
    });
}