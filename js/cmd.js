#!/usr/bin/env node
// Copyright (c) 2020 Kriss @ Wetgenes.com
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var cmd=exports;

var pfs=require("pify")( require("fs") )

var stringify = require('json-stable-stringify');


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
		return
	}

	// help text
	console.log(
`
>	mamelist parse

Parse {dir}/mamelist.xml and {dir}/roms/* to create sorted symlinked 
copies of available roms and info dump files into {dir}/list/* folders.

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
