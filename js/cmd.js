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

	argv.from = argv.from || process.env.MAMELIST_FROM || "from"
	argv.into = argv.into || process.env.MAMELIST_INTO || "into"

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

Parse {from}/mamelist.xml and {from}/roms/* to create sorted symlinked 
copies of available roms and info dump files into {into}/ folders.

	--from from
	Directory to process data from.

	--into into
	Directory to process data into.

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
