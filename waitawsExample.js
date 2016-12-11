// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var wait = require('wait.for');
function testFunction(){
  // Create an S3 client
  this.machinelearning = new AWS.MachineLearning({
  	endpoint:'machinelearning.us-east-1.amazonaws.com',
  	region: 'us-east-1'
  });
  // Create a bucket and upload something into it
  this.uuidDS = uuid.v4();
  this.id = 'node-sdk-sample-banking-demo-code' + uuidDS ;
  this.trainingDataUrl = "s3://aml-sample-data/banking.csv";
  this.schemaFilename = "banking.csv.schema";
  this.recipeFilename = "recipe.json";
  this.friendlyEntityName = "Java Marketing Sample";
  this.percentBegin = 0;
  this.percentEnd = 70;
  this.dataRearrangementString = "{\"splitting\":{\"percentBegin\":"+percentBegin+",\"percentEnd\":"+percentEnd+"}}";
  this.dataSchemaContentsJson = require('./banking.json');  
  this.dataSchemaContents = JSON.stringify(dataSchemaContentsJson)   ;
  console.log(dataSchemaContents);
  this.paramsDS = {
    DataSourceId: uuidDS, /* required */
    DataSpec: { /* required */
      DataLocationS3: trainingDataUrl, /* required */
      DataRearrangement: dataRearrangementString,
      DataSchema: dataSchemaContents   
    },
    ComputeStatistics: true,
    DataSourceName: id
  };
  this.func1 = function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  };
  console.log('fiber start');
  this.result = wait.for(machinelearning.createDataSourceFromS3,paramsDS);
  console.log('function returned:', result);
  console.log('fiber end');
};


console.log('app start');
wait.launchFiber(testFunction);
console.log('after launch');


