"use strict";
var sdklib = function(customConsole) {
	this.init(customConsole);
}

sdklib.prototype.dummy = function () {
	this.console.printConsole('dummy Method');
	privateFun(this);
}	
sdklib.prototype.setConsole = function (customConsole) {
	this.console = customConsole;
}	
sdklib.prototype.init = function (customConsole) {
	this.customConsole = customConsole;
	this.exampleVar = 1;
	// this.console.printConsole('Init Method');
	this.AWS = require('aws-sdk');
	this.uuid = require('node-uuid');
	this.wait = require('wait.for');
	this.machinelearning =  new this.AWS.MachineLearning({
	  endpoint:'machinelearning.us-east-1.amazonaws.com',
	  region: 'us-east-1'
	});
	this.dsId = null;
	this.dsName = null;
	this.mlId =  null;
	this.mlName = null;
}
sdklib.prototype.createDataSource = function () {
	this.console.printConsole('createDataSource Method');
	this.dsId = this.uuid.v4();
	this.dsName = 'node-dsname-'+ this.dsId;
	this.trainingDataUrl = "s3://aml-sample-data/banking.csv";
	this.percentBegin = 0;
    this.percentEnd = 70;
    this.dataRearrangementString = "{\"splitting\":{\"percentBegin\":"+this.percentBegin+",\"percentEnd\":"+this.percentEnd+"}}";
	var dataSchemaContents  = JSON.stringify(require('./banking.json'));
	var paramsDS = {
      DataSourceId: this.dsId, /* required */
      DataSpec: { /* required */
        DataLocationS3: this.trainingDataUrl, /* required */
        DataRearrangement: this.dataRearrangementString,
        DataSchema: dataSchemaContents   
      },
      ComputeStatistics: true,
      DataSourceName: this.dsName
    };
    this.console.printConsole('This is the DS ID :::: ' + this.dsId);
    this.console.printConsole('This is DS Nmae :::::: ' + this.dsName);

    this.machinelearning.createDataSourceFromS3(paramsDS, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      }  
      else {
        // console.log('-------------------------------------------------------JOY');
        this.console.printConsole(data);           // successful response    
        this.console.printConsole(data.DataSourceId);
      }
    }.bind(this));    
};
sdklib.prototype.createMLModel = function () {
	this.console.printConsole('createMLModel Method');
	this.console.printConsole('This is DS Nmae :::::: ' + this.dsName);
	this.console.printConsole('This is DS Nmae :::::: ' + this.dsId);
	this.mlId = this.uuid.v4();
	this.mlName = 'node-MLModel-'+ this.mlId;
	this.console.printConsole('This is MLNAME :::: ' + this.mlName);
	var paramsDS = {
	    FilterVariable : 'Name', /* required */
	    EQ: this.dsName
	};
	this.machinelearning.waitFor('dataSourceAvailable', paramsDS, function(err, data) {
	this.console.printConsole('-------------------- waitFor ::  dataSourceAvailable --------------------');
	 if (err) console.log(err, err.stack); // an error occurred
	  	else {
	  		console.log(data);           // successful response
	  		this.console.printConsole(data.Results[0].Status);
	  		if(data.Results[0].Status.toUpperCase() === 'COMPLETED'.toUpperCase()) {
	  			this.console.printConsole('Data Source ::: ' + this.dsId + 'Status is completed**');
	  			var recipeContents  = JSON.stringify(require('./Recipe.json'));
	  			
	  			var paramsML = {
			      MLModelId: this.mlId, /* required */
			      MLModelType: 'BINARY', /* required */
			      TrainingDataSourceId: this.dsId, /* required */
			      MLModelName: this.mlName,
			      Parameters: {
			        'sgd.maxPasses' : '100',
			        'sgd.maxMLModelSizeInBytes' : '104857600',
			        'sgd.l2RegularizationAmount' : '1e-4'
			      },
			      Recipe: recipeContents
			    };
			    this.machinelearning.createMLModel(paramsML, function(err, data) {
		          if (err) console.log(err, err.stack); // an error occurred
		          else     { 
		          	this.console.printDir("Create ML Model COmpleted :::", data);
		          } 	
  				}.bind(this));
  			}
  		}				
	}.bind(this));
};	
sdklib.prototype.createEvaluation = function () {
	this.console.printConsole('createEvaluation Method');
	this.evalId = this.uuid.v4();
    this.evalName = 'node-Evaluation-' + this.evalId;
	this.console.printConsole('This is DS Nmae :::::: ' + this.dsName);
	this.console.printConsole('This is DS ID :::::: ' + this.dsId);
	this.console.printConsole('This is MLMOdel Nmae :::::: ' + this.mlName);
	this.console.printConsole('This is MLMOdel ID :::::: ' + this.mlId);
	this.console.printConsole('This is Evaluation Nmae :::::: ' + this.evalName);
	this.console.printConsole('This is Evaluation ID :::::: ' + this.evalId);
	var paramsDS = {
	    FilterVariable : 'Name', /* required */
	    EQ: this.mlName
	};
	this.machinelearning.waitFor('mLModelAvailable', paramsDS, function(err, data) {
	  	this.console.printConsole('-------------------- waitFor ::  mLModelAvailable --------------------');
	 	if (err) console.log(err, err.stack); // an error occurred
	  	else {
	  		console.log(data);           // successful response
	  		this.console.printConsole(data.Results[0].Status);
	  		if(data.Results[0].Status.toUpperCase() === 'COMPLETED'.toUpperCase()) {
	  			this.console.printConsole('MLModel ::: ' + this.mlName + 'Status is completed**');
	  			var paramsEvaluation = {
	              EvaluationDataSourceId: this.dsId, /* required */
	              EvaluationId: this.evalId, /* required */
	              MLModelId: this.mlId, /* required */
	              EvaluationName: this.evalName
	            };
			    this.machinelearning.createEvaluation(paramsEvaluation, function(err, data) {
		          if (err) console.log(err, err.stack); // an error occurred
		          else     { 
		          	this.console.printDir("Create ML Model COmpleted :::", data);
		          } 	
  				}.bind(this));
  			}
  		}				
	}.bind(this));
};	
sdklib.prototype.createPredict = function (req,res) {
	this.console.printConsole('createPredict Method');
	var params = {
	  MLModelId: this.mlId /* required */
	};
	this.machinelearning.createRealtimeEndpoint(params, function(err, data) {

	  if (err) console.log(err, err.stack); // an error occurred
	  else    {
	    console.log(data);           // successful response
	    console.log('--------------------INFO---------------------------');
	    console.dir(data.RealtimeEndpointInfo.EndpointUrl);         
	    this.realTimeEndPointUrl = data.RealtimeEndpointInfo.EndpointUrl;
	    var params = {
	      MLModelId: this.mlId, /* required */
	      PredictEndpoint: this.realTimeEndPointUrl, /* required */
	      Record: { /* required */
	        'textVar': 'Multiple words grouped together',
	        'numericVar': '123'
	      }
	    };
	    this.machinelearning.predict(params, function(err, data) {
	      if (err) console.log(err, err.stack); // an error occurred
	      else {
	      	console.log(data);           // successful response
	      	res.send(data);
	      }
	    }.bind(this));
	  }     
	}.bind(this));
};	
sdklib.prototype.describeEvaluations = function (req,res) {
	this.console.printConsole('describeEvaluations Method');
	var params = {
		FilterVariable: 'MLModelId', /* required */
		EQ: this.mlId,
	};
	this.machinelearning.describeEvaluations(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
	      	console.log(data);           // successful response
	      	res.send(data);
      	}
	}.bind(this));
};	
sdklib.prototype.describeDataSources = function (req,res) {
	this.console.printConsole('describeDataSources Method');
	var params = {
	    FilterVariable: 'Name', /* required */
	    EQ: this.dsName,
	};
	this.machinelearning.describeDataSources(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
	      	console.log(data);           // successful response
	      	res.send(data);
      	}
	}.bind(this));
};	
sdklib.prototype.getEvaluation = function (req,res) {
	this.console.printConsole('getEvaluation Method');
	var params = {
	  EvaluationId: this.evalId /* required */
	};
	this.machinelearning.getEvaluation(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
	      	console.log(data);           // successful response
	      	res.send(data);
      	}
	}.bind(this));
};	
sdklib.prototype.getDataSource = function (req,res) {
	this.console.printConsole('getDataSource Method');
	var params = {
	  DataSourceId: this.dsId /* required */,
	  Verbose: true
	};
	this.machinelearning.getDataSource(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
	      	console.log(data);           // successful response
	      	res.send(data);
      	}
	}.bind(this));
};	
sdklib.prototype.waitForDataSourceName = function () {
	this.console.printConsole('waitForDataSource Method');
	this.console.printConsole('This is DS Nmae :::::: ' + this.dsName);
	var paramsDS = {
	    FilterVariable : 'Name', /* required */
	    EQ: this.dsName
	};
	this.machinelearning.waitFor('dataSourceAvailable', paramsDS, function(err, data) {
	  this.console.printConsole('-------------------- waitFor ::  dataSourceAvailable --------------------');
	  	if (err) console.log(err, err.stack); // an error occurred
	  	else {
	  		console.log(data);           // successful response
	  		this.console.printConsole(data.Results[0].Status);
	  		if(data.Results[0].Status.toUpperCase() === 'COMPLETED'.toUpperCase()) {
	  			this.console.printConsole('Status is completed as per the ----------------');
  		}
	  } 
	}.bind(this));
};	
sdklib.prototype.waitForMLModel = function () {
	this.console.printConsole('waitForMLModel Method');
	this.console.printConsole('This is MLMdel Nmae :::::: ' + this.mlName);
	var paramsDS = {
	    FilterVariable : 'Name', /* required */
	    EQ: this.mlName
	};
	this.machinelearning.waitFor('mLModelAvailable', paramsDS, function(err, data) {
	  	this.console.printConsole('-------------------- waitFor ::  mLModelAvailable --------------------');
	  	if (err) console.log(err, err.stack); // an error occurred
	  	else {
	  		console.log(data);           // successful response
	  		this.console.printConsole(data.Results[0].Status);
	  		if(data.Results[0].Status.toUpperCase() === 'COMPLETED'.toUpperCase()) {
	  			this.console.printConsole('ML Model ID ::' + this.mlId  + ' :: Status is completed as per the ----------------');
  			}
	  	} 
	}.bind(this));
};	
sdklib.prototype.waitForEvaluation = function () {
	this.console.printConsole('Evaluation Method');
	this.console.printConsole('This is Evaluation Nmae :::::: ' + this.evalName);
	var paramsDS = {
	    FilterVariable : 'Name', /* required */
	    EQ: this.evalName
	};
	this.machinelearning.waitFor('evaluationAvailable', paramsDS, function(err, data) {
	  	this.console.printConsole('-------------------- waitFor ::  mLModelAvailable --------------------');
	  	if (err) console.log(err, err.stack); // an error occurred
	  	else {
	  		console.log(data);           // successful response
	  		this.console.printConsole(data.Results[0].Status);
	  		if(data.Results[0].Status.toUpperCase() === 'COMPLETED'.toUpperCase()) {
	  			this.console.printConsole('Evaluation ID ::' + this.evalId  + ' :: Status is completed as per the ----------------');
  			}
	  	} 
	}.bind(this));
};	


module.exports = new sdklib();