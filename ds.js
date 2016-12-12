"use strict";
var DS = function() {
	this.console = 1; //0 = No Console Outputs, 1 = Console Outputs
	this.DS = [];
	this.exampleVar = 1;
	this.init();
}
DS.prototype.isConsole = function () {
	return (this.console==1) ? true : false;
}	
DS.prototype.printConsole = function (text) {
	this.isConsole() ? console.log(text) : null ;
}	
DS.prototype.printDir = function (text, dirText) {
	if(this.isConsole()) {
		this.printConsole(text); 
		console.dir(dirText);
	} 
}	


module.exports = new DS();