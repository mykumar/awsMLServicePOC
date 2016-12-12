var as = require('./aws-sdk.js');
// var ds = require('./ds.js');
// as.createDataSource();
// as.waitForDataSourceName();
as.dsId  = 'e013b0a0-8f10-40a6-b4dd-6474ffb642b6';
as.dsName = 'node-dsname-e013b0a0-8f10-40a6-b4dd-6474ffb642b6';
as.mlId = '80b155f6-0b91-4fef-ae77-cf5f546218ad';
as.mlName = 'node-MLModel-80b155f6-0b91-4fef-ae77-cf5f546218ad';
as.evalId = 'efb9deee-f875-4fea-bedc-6f956c6a3a7f';
as.evalName = 'node-Evaluation-efb9deee-f875-4fea-bedc-6f956c6a3a7f';

// as.createMLModel();
// as.waitForMLModel();
// as.createEvaluation();
// as.waitForEvaluation();

as.createPredict();

console.log('this is the console.log');
// as.dummy();
// console.log('this is the console.log');


// var as2 = require('./aws-sdk.js');
// as2.hey();
// var as3 = require('./aws-sdk.js');
// as3.hey();
// as.hey();
// as.hey();
// as.hey();
// as.hey();