var express = require('express');
var app = express();
var abc = "Thgis ios abc";
var as = require('./aws-sdk.js');
var con = require('./console.js');
//Testing Data
as.setConsole(con);
as.dsId  = 'e013b0a0-8f10-40a6-b4dd-6474ffb642b6';
as.dsName = 'node-dsname-e013b0a0-8f10-40a6-b4dd-6474ffb642b6';
as.mlId = '80b155f6-0b91-4fef-ae77-cf5f546218ad';
as.mlName = 'node-MLModel-80b155f6-0b91-4fef-ae77-cf5f546218ad';
as.evalId = 'efb9deee-f875-4fea-bedc-6f956c6a3a7f';
as.evalName = 'node-Evaluation-efb9deee-f875-4fea-bedc-6f956c6a3a7f';	

app.get('/predict', function (req, res) {
	as.createPredict(req, res);
});
app.get('/describeEvaluations', function (req, res) {
    as.describeEvaluations(req, res);
});
app.get('/getEvaluation', function (req, res) {
    as.getEvaluation(req, res);
});
app.get('/describeDataSources', function (req, res) {
    as.describeDataSources(req, res);
});
app.get('/getDataSource', function (req, res) {
    as.getDataSource(req, res);
});
app.get('/', function (req, res) {
  res.send('Hello World!' + abc);
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
