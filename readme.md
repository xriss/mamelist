# mame -listxml

Step one is grab a bunch of roms, eg from https://archive.org/

now we try and sort through mame roms and remove the ones that do not 
make sense on a real mamecab, eg drop the mahjong and the home 
computers and mechanical etc etc.

Hardcoded decisions so it is up to you to mess with js/sort.js and 
change the filtering if you want.

This is nodejs so should work anywhere but we are assuming you are 
using bash here.

This repo is also published to https://www.npmjs.com/package/mamelist 
so you could skip this first install step and just use `npx mamelist` 
instead as a replacement for `.mamelist` in the instructions bellow. 
npx will auto download from npm and run using node.


First clone this repo and cd into it then...

	npm install
	./mamelist

This will install dependencies and do a test run that will also explain 
the command line options available.

From here on we assume your mame files are in ~/mame/ so your roms are 
in ~/mame/roms/ you will need to adjust that if they are somewhere 
else. First get listxml from your mame, this does assume you have mame 
installed and working.

	mame -listxml >~/mame/mamelist.xml

Then convert this xml file to a json file with some info striped and 
some info added, this will only include roms that you have. Think of 
this json as enough information for a reasonable launcher.

	./mamelist parse --dir ~/mame

Finally we make a ~/mame/romsort with subdirectories full of sorted 
roms, these roms are hardlinked files so do not actually take up any 
more space.

	./mamelist sort --dir ~/mame

Now I can copy the roms I want from these directories to my arcade cab, 
I actually only care about 19xx so I just grab that dir. What to do 
here is up to you, the roms have been sorted into folders and I found 
that rather helpful, for me it dropped a lot of files that I do not 
care about as they do not make sense in a real arcade machine.

There will be duplicates, so best to merge them all into one folder 
when copying.
