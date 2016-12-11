// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var fs = require('fs');

var func1 = function() {
    // Create a bucket and upload something into it
    this.examplevar  = "This is the example variable";
    var uuidDS = uuid.v4();
    var id = 'node-sdk-sample-banking-demo-code' + uuidDS ;
    var trainingDataUrl = "s3://aml-sample-data/banking.csv";
    var schemaFilename = "banking.csv.schema";
    var recipeFilename = "recipe.json";
    var friendlyEntityName = "Java Marketing Sample";
    var percentBegin = 0;
    var percentEnd = 70;
    var dataRearrangementString = "{\"splitting\":{\"percentBegin\":"+percentBegin+",\"percentEnd\":"+percentEnd+"}}";
    var dataSchemaContentsJson = require('./banking.json');  
    console.log(dataSchemaContentsJson);
    var dataSchemaContents = JSON.stringify(dataSchemaContentsJson)   ;
    console.log(dataSchemaContents);

    // Create an S3 client
    var machinelearning = new AWS.MachineLearning({
      endpoint:'machinelearning.us-east-1.amazonaws.com',
      region: 'us-east-1'
    });
    // if(IsJsonString(dataSchemaContents)) {
    // 	console.log("\n \n \n This is good to go.........");
    // }
    // function IsJsonString(str) {
    //     try {
    //         JSON.parse(str);
    //     } catch (e) {
    //         return false;
    //     }
    //     return true;
    // }
    var paramsDS = {
      DataSourceId: uuidDS, /* required */
      DataSpec: { /* required */
        DataLocationS3: trainingDataUrl, /* required */
        DataRearrangement: dataRearrangementString,
        DataSchema: dataSchemaContents   
      },
      ComputeStatistics: true,
      DataSourceName: id
    };
    var that = this;
    machinelearning.createDataSourceFromS3(paramsDS, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      }  
      else {
        // console.log('-------------------------------------------------------JOY');
        console.log(data);           // successful response    
        console.log(data.DataSourceId);
        console.log(this.examplevar);
        // var uuidML = this.uuid.v4();
        // var MLModelName = 'ML-node-sdk-sample-banking-demo-code' + uuidML ;
        // console.log('---------------------UUID------------------------ ');    
        // console.log(uuidML);
        // console.log('---------------------MLModelName------------------------ ');    
        // console.log(MLModelName);
        // var paramsML = {
        //   MLModelId: 'STRING_VALUE', /* required */
        //   MLModelType: 'REGRESSION | BINARY | MULTICLASS', /* required */
        //   TrainingDataSourceId: 'STRING_VALUE', /* required */
        //   MLModelName: 'STRING_VALUE',
        //   Parameters: {
        //     someKey: 'STRING_VALUE',
        //      anotherKey: ... 
        //   },
        //   Recipe: 'STRING_VALUE',
        //   RecipeUri: 'STRING_VALUE'
        // };
        // machinelearning.createMLModel(paramsML, function(err, data) {
        //   if (err) console.log(err, err.stack); // an error occurred
        //   else     console.log(data);           // successful response
        // });
      // } 
    }}.bind(this));
}

func1();