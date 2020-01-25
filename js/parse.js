#!/usr/bin/env node
// Copyright (c) 2020 Kriss @ Wetgenes.com
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var parse=exports;

var pfs=require("pify")( require("fs") )

var stringify = require('json-stable-stringify')


var jml=require("./jml")


var util=require("util")
var ls=function(a) { console.log(util.inspect(a,{depth:null})) }


parse.run=async function(argv)
{

	var fn=argv.dir+"/mamelist.xml"
	console.log( "Reading "+fn )
	var jdat=jml.from_xml( await pfs.readFile(fn,{ encoding: 'utf8' }) )
	
	console.log( "Parsing "+fn )

	let l={}
	for( var v of jdat[1] )
	{
		var m={}
		
		for( var n in v )
		{
			if(isNaN(n)) { m[n]=v[n] } // real string
		}
		
		for( var t of v[1] )
		{
			if( Array.isArray(t[1]) && (t[1].length==1) && ( typeof t[1][0] == "string" ) )
			{
				m[ t[0] ]=t[1][0]
			}
			else
			if( t[0]=="display")
			{
				var display={}
				for( var n in t )
				{
					if(isNaN(n)) { display[n]=t[n] } // real string
				}
				m.displays=m.displays || []
				m.displays.push(display)
			}
			else
			if( t[0]=="input")
			{
				var input={}
				for( var n in t )
				{
					if(isNaN(n)) { input[n]=t[n] } // real string
				}
				if(t[1])
				for( var tt of t[1] ) // recurse
				{
					if(tt[0]=="control")
					{
						var control={}
						for( var c in tt )
						{
							if(isNaN(c)) { control[c]=tt[c] } // real string
						}
						input.controls=input.controls || []
						input.controls.push(control)
					}
				}
				m.input=input
			}
		}
		
		try{
			var fn = argv.dir+"/roms/"+m.name+".zip"
//			console.log(fn)
			var fs = await pfs.stat( fn )
			if( fs ) // check we have the rom
			{
				m.filesize=fs.size
			}
		}
		catch(e){}

		l[m.name]=m
	}


	var genre="none"
	var lines=( await pfs.readFile(__dirname+"/../cat32en/Genre.ini",{ encoding: 'utf8' }) ).split(/\r?\n/)

	for(var line of lines)
	{
		if(line[0]=="[")
		{
			genre=line.replace(/[^0-9a-z ]/gi, '').trim().toLowerCase().replace(/\s+/g,"_")
		}
		else
		{
			var name=line.replace(/[^0-9a-z ]/gi, '').trim().toLowerCase().replace(/\s+/g,"_")
			
			var rom=l[name]
			if(rom)
			{
				rom.genre=genre
			}
		}
	}

	var fn=argv.dir+"/mamelist.json"
	console.log( "Writing "+fn )
	await pfs.writeFile(fn,stringify(l,{space:" "}))

}
