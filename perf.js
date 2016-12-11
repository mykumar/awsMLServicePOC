var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var uuidML = 'cead2f9c-19c7-496e-a816-916af48bbe09';

var params = {
    FilterVariable: 'MLModelId', /* required */
    EQ: this.uuidML,
};

var machinelearning =  new AWS.MachineLearning({
  endpoint:'machinelearning.us-east-1.amazonaws.com',
  region: 'us-east-1'
});

machinelearning.describeEvaluations(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response

  var res = data.Results[0].PerformanceMetrics;

  console.dir(res);



});