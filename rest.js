var express = require('express');
var app = express();
var abc = "Thgis ios abc";
var as = require('./aws-sdk.js');
var con = require('./console.js');
//Testing Data
as.setConsole(con);
// as.dsId  = 'e013b0a0-8f10-40a6-b4dd-6474ffb642b6';
// as.dsName = 'node-dsname-e013b0a0-8f10-40a6-b4dd-6474ffb642b6';
// as.mlId = '80b155f6-0b91-4fef-ae77-cf5f546218ad';
// as.mlName = 'node-MLModel-80b155f6-0b91-4fef-ae77-cf5f546218ad';
// as.evalId = 'efb9deee-f875-4fea-bedc-6f956c6a3a7f';
// as.evalName = 'node-Evaluation-efb9deee-f875-4fea-bedc-6f956c6a3a7f';	
//-------------------------CREATE--------------------------------
app.get('/createDataSource', function (req, res) {
	as.createDataSource(req, res);
});
app.get('/createMLModel', function (req, res) {
	as.createMLModel(req, res);
});
app.get('/createEvaluation', function (req, res) {
	as.createEvaluation(req, res);
});
//-------------------------PREDICT--------------------------------
app.get('/predict', function (req, res) {
	as.createPredict(req, res);
});
//-------------------------DESCRIBE--------------------------------
app.get('/describeDataSources', function (req, res) {
    as.describeDataSources(req, res);
});
app.get('/describeMLModels', function (req, res) {
    as.describeMLModels(req, res);
});
app.get('/describeEvaluations', function (req, res) {
    as.describeEvaluations(req, res);
});
//-------------------------GET--------------------------------
app.get('/getDataSource', function (req, res) {
    as.getDataSource(req, res);
});
app.get('/getMLModel', function (req, res) {
    as.getMLModel(req, res);
});
app.get('/getEvaluation', function (req, res) {
    as.getEvaluation(req, res);
});
//-------------------------WAIT--------------------------------
app.get('/waitForDataSourceName', function (req, res) {
    as.waitForDataSourceName(req, res);
});
app.get('/waitForMLModel', function (req, res) {
    as.waitForMLModel(req, res);
});
app.get('/waitForEvaluation', function (req, res) {
    as.waitForEvaluation(req, res);
});
//-------------------------UPDATE--------------------------------
app.get('/updateDataSource', function (req, res) {
    as.updateDataSource(req, res);
});
app.get('/updateMLModel', function (req, res) {
    as.updateMLModel(req, res);
});
app.get('/updateEvaluation', function (req, res) {
    as.updateEvaluation(req, res);
});
//-------------------------Delete--------------------------------
app.get('/deleteDataSource', function (req, res) {
    as.deleteDataSource(req, res);
});
app.get('/deleteMLModel', function (req, res) {
    as.deleteMLModel(req, res);
});
app.get('/deleteEvaluation', function (req, res) {
    as.deleteEvaluation(req, res);
});
app.get('/deleteRealtimeEndpoint', function (req, res) {
    as.deleteRealtimeEndpoint(req, res);
});

app.get('/', function (req, res) {
  res.send('Hello World!' + abc);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
