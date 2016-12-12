"use strict";
var sdklib = function() {
	this.initi();
}

sdklib.prototype.dummy = function () {
	this.printConsole('dummy Method');
	privateFun(this);
}	

sdklib.prototype.initi = function () {
	this.console = 1; //0 = No Console Outputs, 1 = Console Outputs
	this.exampleVar = 1;
	this.printConsole('Init Method');
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
	this.printConsole('createDataSource Method');
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
    this.printConsole('This is the DS ID :::: ' + this.dsId);
    this.printConsole('This is DS Nmae :::::: ' + this.dsName);

    this.machinelearning.createDataSourceFromS3(paramsDS, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      }  
      else {
        // console.log('-------------------------------------------------------JOY');
        this.printConsole(data);           // successful response    
        this.printConsole(data.DataSourceId);
      }
    }.bind(this));    
};

sdklib.prototype.waitForDataSourceName = function () {
	this.printConsole('waitForDataSource Method');
	this.printConsole('This is DS Nmae :::::: ' + this.dsName);
	var paramsDS = {
	    FilterVariable : 'Name', /* required */
	    EQ: this.dsName
	};
	this.machinelearning.waitFor('dataSourceAvailable', paramsDS, function(err, data) {
	  this.printConsole('-------------------- waitFor ::  dataSourceAvailable --------------------');
	  	if (err) console.log(err, err.stack); // an error occurred
	  	else {
	  		console.log(data);           // successful response
	  		this.printConsole(data.Results[0].Status);
	  		if(data.Results[0].Status.toUpperCase() === 'COMPLETED'.toUpperCase()) {
	  			this.printConsole('Status is completed as per the ----------------');
  		}


	  } 
	}.bind(this));
};	

sdklib.prototype.createMLModel = function () {
	this.printConsole('createMLModel Method');
	this.printConsole('This is DS Nmae :::::: ' + this.dsName);
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
	this.machinelearning.waitFor('dataSourceAvailable', paramsDS, function(err, data) {
	  this.printConsole('-------------------- waitFor ::  dataSourceAvailable --------------------');
	 if (err) console.log(err, err.stack); // an error occurred
	  	else {
	  		console.log(data);           // successful response
	  		this.printConsole(data.Results[0].Status);
	  		if(data.Results[0].Status.toUpperCase() === 'COMPLETED'.toUpperCase()) {
	  			this.printConsole('Data Source ::: ' +  + 'Status is completed**');
	  			var recipeContents  = JSON.stringify(require('./Recipe.json'));
	  			this.mlId = this.uuid.v4();
				this.mlName = 'node-dsname-'+ this.dsId;
	  			this.paramsML = {
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
		          	this.printDir("Create ML Model COmpleted :::", data);
		          } 	
  				}
  			}		
	}.bind(this));
};	


sdklib.prototype.waitForDataSourceMain = function () {
	this.printConsole('waitForDataSourceMain Method');
	return this.wait.launchFiber(waitForDataSource, this); //handle in a fiber, keep node spinning	
}	



//----------------------------------------Private Methods----------------------------------------------------------
function privateFun (that) {
	that.printConsole('privateFun Method');
}

function waitForDataSource (that) {
	that.printConsole('waitForDataSource Method');
	var paramsDS = {
	    FilterVariable : 'Name', /* required */
	    EQ: 'changed-node-sdk-sample-banking-demo-code69af4455-c576-476a-ae84-715f13277073',
	};
	var result = that.wait.forMethod(that.machinelearning, 'waitFor', 'dataSourceAvailable', paramsDS);
	that.printConsole('waitForDataSource Method-- second line');
	that.printDir("wait for result is ::", result);
	return "tis is success";
}	

sdklib.prototype.isConsole = function () {
	return (this.console==1) ? true : false;
}	
sdklib.prototype.printConsole = function (text) {
	this.isConsole() ? console.log(text) : null ;
}	
sdklib.prototype.printDir = function (text, dirText) {
	if(this.isConsole()) {
		this.printConsole(text); 
		console.dir(dirText);
	} 
}	

module.exports = new sdklib();