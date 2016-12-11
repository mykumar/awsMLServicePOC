// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var Promise = require('bluebird');

console.log('--------------------------------- Creating the ML Instance ---------------------------------');
var machinelearning = new AWS.MachineLearning({
	endpoint:'machinelearning.us-east-1.amazonaws.com',
	region: 'us-east-1'
});


// var createDataSourceFromS3 = Promise.promisify(machinelearning.createDataSourceFromS3);
// Data Source
var uuidDS = uuid.v4();
var idDS = 'node-sdk-sample-banking-demo-code' + uuidDS ;
var trainingDataUrl = "s3://aml-sample-data/banking.csv";
var percentBegin = 0;
var percentEnd = 70;
var dataRearrangementString = "{\"splitting\":{\"percentBegin\":"+percentBegin+",\"percentEnd\":"+percentEnd+"}}";
var dataSchemaContentsJson = require('./banking.json');  
var dataSchemaContents = JSON.stringify(dataSchemaContentsJson)   ;
var datasourceID = null;
console.log(dataSchemaContentsJson);
console.log(dataSchemaContents);

console.log('--------------------------------- Creating the datasource ---------------------------------');

var paramsDS = {
  DataSourceId: uuidDS, /* required */
  DataSpec: { /* required */
    DataLocationS3: trainingDataUrl, /* required */
    DataRearrangement: dataRearrangementString,
    DataSchema: dataSchemaContents   
  },
  ComputeStatistics: true,
  DataSourceName: idDS
};

var createDataSourceFromS3Func = machinelearning.createDataSourceFromS3(paramsDS).promise();

var funcExtra  = function(data) {
  console.log('----------------------funcExtra----------------------------------');
  console.log(datasourceID);
  datasourceID = data;
}

var print = function() {
  console.log('----------------------print----------------------------------');
  console.log(datasourceID); 
}
var funcCallback = function(err, data) {
    console.log('----funcCallback----------------------------------');
    funcExtra(data);
    
};


createDataSourceFromS3Func.then(funcCallback).catch(function(e) {
    console.log("Error ::::: ", e);
});

console.log('--------------------------------- Printing ---------------------------------');
setTimeout(print, 10000);
