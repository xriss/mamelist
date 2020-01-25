#!/usr/bin/env node
// Copyright (c) 2020 Kriss @ Wetgenes.com
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var sort=exports;

var pfs=require("pify")( require("fs-extra") )

var stringify = require('json-stable-stringify')


var jml=require("./jml")


var util=require("util")
var ls=function(a) { console.log(util.inspect(a,{depth:null})) }



sort.run=async function(argv)
{
	var fn=argv.dir+"/mamelist.json"
	console.log( "Reading "+fn )
	var roms=JSON.parse( await pfs.readFile(fn,{ encoding: 'utf8' }) )
	

	var forcepush=function(t,n,v) { t[n]=t[n] || [] ; t[n].push(v) }
	var dirs={}


//console.log(roms)
	for( var name in roms )
	{
		var rom=roms[name]

		var ok=true
		
		if( rom.ismechanical   ) { ok=false } // mechanical
		if( ! rom.filesize     ) { ok=false } // no file
		if( ! rom.displays     ) { ok=false } // no display

		if( ! rom.input        ) { ok=false } // no input
		else
		{
			if( ! rom.input.controls ) { ok=false } // no control
			else
			{
				for( var control of rom.input.controls )
				{
					if( control.type == "mahjong" ) { ok=false } // no mahjong
				}
			}
		}

		
		if(ok)
		{
			forcepush(dirs,"ok",rom.name)
			
			if(rom.year)
			{
				var decade=rom.year[0]+rom.year[1]+rom.year[2]
				if( !isNaN(decade) )
				{
					forcepush(dirs,decade+"x",rom.name)
				}
			}
		}

	}
	


	console.log( "Deleting all files in "+argv.dir+"/romsort" )
	await pfs.emptyDir( argv.dir+"/romsort" )

	for( var dir in dirs )
	{
		console.log( "Creating symlinks in "+argv.dir+"/romsort/"+dir )
		await pfs.emptyDir( argv.dir+"/romsort/"+dir )

		for( var name of dirs[dir] )
		{
			await pfs.link(argv.dir+"/roms/"+name+".zip",argv.dir+"/romsort/"+dir+"/"+name+".zip")
//			await pfs.symlink("../../roms/"+name+".zip",argv.dir+"/romsort/"+dir+"/"+name+".zip")
		}
	}

}
