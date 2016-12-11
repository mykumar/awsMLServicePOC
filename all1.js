// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var fs = require('fs');

var create = function() {
    // Create a bucket and upload something into it
    this.AWS = require('aws-sdk');
    this.uuid = require('node-uuid');
    this.fs = require('fs');
    this.examplethis = "This is the example variable";
    this.uuidDS = this.uuid.v4();
    this.id = 'node-sdk-sample-banking-demo-code' + uuidDS ;
    this.trainingDataUrl = "s3://aml-sample-data/banking.csv";
    this.schemaFilename = "banking.csv.schema";
    this.recipeFilename = "recipe.json";
    this.friendlyEntityName = "Java Marketing Sample";
    this.percentBegin = 0;
    this.percentEnd = 70;
    this.dataRearrangementString = "{\"splitting\":{\"percentBegin\":"+this.percentBegin+",\"percentEnd\":"+this.percentEnd+"}}";
    this.dataSchemaContentsJson = require('./banking.json');  
    console.log(this.dataSchemaContentsJson);
    this.dataSchemaContents = JSON.stringify(this.dataSchemaContentsJson)   ;
    console.log(this.dataSchemaContents);

    this.machinelearning = new AWS.MachineLearning({
      endpoint:'machinelearning.us-east-1.amazonaws.com',
      region: 'us-east-1'
    });
    this.paramsDS = {
      DataSourceId: this.uuidDS, /* required */
      DataSpec: { /* required */
        DataLocationS3: this.trainingDataUrl, /* required */
        DataRearrangement: this.dataRearrangementString,
        DataSchema: this.dataSchemaContents   
      },
      ComputeStatistics: true,
      DataSourceName: this.id
    };
    this.machinelearning.createDataSourceFromS3(this.paramsDS, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      }  
      else {
        // console.log('-------------------------------------------------------JOY');
        console.log(data);           // successful response    
        console.log(data.DataSourceId);
        console.log(this.examplethis);

        this.DataSourceId = data.DataSourceId;
        this.uuidML = this.uuid.v4();
        this.MLModelName = 'ML-node-sdk-sample-banking-demo-code' + uuidML ;
        console.log('---------------------UUID------------------------');    
        console.log(uuidML);
        console.log('---------------------MLModelName------------------------');    
        console.log(MLModelName);
        this.recpJson = require('./recp1.json');  
        console.log(this.recpJson);
        this.recpJsonContents = JSON.stringify(this.recpJson)   ;
        console.log(this.recpJsonContents);

        this.paramsML = {
          MLModelId: this.uuidML, /* required */
          MLModelType: 'BINARY', /* required */
          TrainingDataSourceId: this.DataSourceId, /* required */
          MLModelName: this.MLModelName,
          Parameters: {
            'sgd.maxPasses' : '100',
            'sgd.maxMLModelSizeInBytes' : '104857600',
            'sgd.l2RegularizationAmount' : '1e-4'
          },
          Recipe: this.recpJsonContents
        };
        this.machinelearning.createMLModel(paramsML, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response

          console.log('---------------Printing the recpeie content in the create ML Model-------------------');
          console.log(this.recpJsonContents);

          this.uuidEval = this.uuid.v4();
          this.ELName = 'ML-node-sdk-sample-banking-demo-code' + uuidML ;

            var params = {
              EvaluationDataSourceId: this.DataSourceId, /* required */
              EvaluationId: this.uuidEval, /* required */
              MLModelId: this.uuidML, /* required */
              EvaluationName: this.ELName
            };
            this.machinelearning.createEvaluation(params, function(err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else     console.log(data);           // successful response

                var params = {
                    FilterVariable: 'MLModelId', /* required */
                    EQ: this.uuidML,
                };

                machinelearning.describeEvaluations(params, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else     console.log(data);           // successful response
                });
            }.bind(this));
        }.bind(this));
    }}.bind(this));
}

create();