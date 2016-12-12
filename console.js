"use strict";

var customConsole = function() {
   this.console = 1; //0 = No Console Outputs, 1 = Console Outputs
}
customConsole.prototype.isConsole = function () {
	return (this.console==1) ? true : false;
}	
customConsole.prototype.printConsole = function (text) {
	this.isConsole() ? console.log(text) : null ;
}	
customConsole.prototype.printDir = function (text, dirText) {
	if(this.isConsole()) {
		this.printConsole(text); 
		console.dir(dirText);
	} 
}	

module.exports = new customConsole();