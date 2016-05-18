// SIMPLE FUNCTION TO STOP ALL RUNNING VMS
// As we are using the AWS sdk without providing configuration
// the lambda function must have the right role to access resources
// and it will run only for on local region

var aws = require('aws-sdk');
exports.handler = (event, context) => {

    var ec2 = new aws.EC2();
    
    // Function that stops instances. 
    // As parameter takes an array of objects passed from the ec2.describeInstances method
    var stopInstances = (instances) => {
        
        // The params object for the ec2.stopInstances is described at 
        // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#stopInstances-property
        var params = {
            InstanceIds: []
        }
        
        // The forEach cycle pushes the id of every Instance object into the param.InstanceId object
        instances.forEach((instance) => { 
            params.InstanceIds.push(instance.InstanceId);
        });
        
        // Now that the array of instances is populated, the ec2.stopInstances method can be run
        ec2.stopInstances(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                context.fail(err); // if any error occurs the lambda will fail logging the error
            } else {
                console.log(data);
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
            console.log(data);
            stopInstances(data.Reservations[0].Instances); // call of stopInstances providing data.Reservations[0].Instances
        }
    });
}