#!/usr/local/bin/node
"use strict";
/*jslint vars:true, white:true, plusplus:true, nomen:true */
/*global  require*/

var hogan = require(__dirname + "/external/hogan.js");
var fs = require("fs");

var filename = __dirname + "/templates/popover.hogan";
var result = "var Templates = {};";

fs.readFile(filename, function (err, content) {
    if(err) {
        throw err;
    }
    var template = hogan.compile(content.toString(), {asString: true});
    result += ";Templates.Popover = new Hogan.Template(" + template + ")";

    fs.writeFile(__dirname + '/compiled_templates.js', result);
});
