#!/usr/bin/env node
// Copyright (c) 2020 Kriss @ Wetgenes.com
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var cmd=exports;

var pfs=require("pify")( require("fs") )

var stringify = require('json-stable-stringify');


var util=require("util")
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }


cmd.parse=function(argv)
{
	argv.filename_mamelist=__filename

	argv.dir = argv.dir || process.env.MAMELIST_DIR || "data"

}

cmd.run=async function(argv)
{

	if( argv._[0]=="parse" )
	{
		return await require("./parse.js").run(argv)
	}
	else
	if( argv._[0]=="sort" )
	{
		return await require("./sort.js").run(argv)
	}

	// help text
	console.log(
`
>	mamelist parse

Parse {dir}/mamelist.xml and check the existence of {dir}/roms/* to 
create a {dir}/mamelist.json file full of usefull information for later 
sorting.

>	mamelist sort

Create symbolic file links to the rom files in grouped sorted and 
filtered directories under {dir}/romsort/ this takes up no more disk 
space. You may then select *ONLY* the directories you want and copy 
them to you mame cab.

	--dir data
	Directory to process data within.

`)
}

// if global.argv is set then we are inside another command so do nothing
if(!global.argv)
{
	var argv = require('yargs').argv
	global.argv=argv
	cmd.parse(argv)
	cmd.run(argv)
}
