#!/usr/bin/env node

/**
 * This file converts Twitter Bootstrap JS files to use define() syntax.
 *
 * It's just a changed jqueryui-amd (https://github.com/jrburke/jqueryui-amd)
 *
 * It should be run in node (only 0.6+).
 */

/*global */
'use strict';

var fs = require( 'fs' ),
    path = require( 'path' ),
    inDir = process.argv[ 2 ],
    optionKey = process.argv[ 3 ],
    jsFileRegExp = /\.js$/,
    exists = fs.existsSync || path.existsSync,
    bootstrapSrcDir,
    bootstrapPaths,
    allPlugins = [];


//Make sure required fields are present.
if ( !inDir ) {
    console.log( 'Usage: bootstrap-amd inputDir' );
    process.exit( 1 );
};

//Normalize directory
inDir = path.normalize( inDir );
if ( inDir.lastIndexOf( '/' ) !== inDir.length - 1 ) {
    inDir += '/';
};

//Make sure there is a js directory in there, otherwise cannot
//convert correctly.
bootstrapSrcDir = path.join( inDir, 'js/' );

if ( !exists(bootstrapSrcDir) || !fs.statSync(bootstrapSrcDir).isDirectory() ) {
    console.log( 'The directory does not appear to contain Twitter Bootstrap, ' +
                 'not converting any files. Looking for "js" directory ' +
                 'in the source directory failed.' );
    process.exit( 1 );
};

//For each file that is a sibling to bootstrap, transform to define.
bootstrapPaths = fs.readdirSync( bootstrapSrcDir );
bootstrapPaths.forEach(function( fileName ) {
    var srcPath = bootstrapSrcDir + fileName;
    if ( fs.statSync(srcPath).isFile() && jsFileRegExp.test(srcPath) ) {
        var content = fs.readFileSync(srcPath, 'utf8');
        allPlugins.push( content );
        //console.log( "Converting file: " + srcPath );
        convert( fileName, content );
    };

    createBootstrapAll();
});

console.log( 'Done. See ' + path.join(inDir, 'bootstrap') + ' for the AMD modules.' );



/* functions */
function mkDir(dir) {
    if ( !exists(dir) ) {
        //511 is decimal for 0777 octal
        fs.mkdirSync( dir, 511 );
    };
};

function createBootstrapAll() {
    var content = allPlugins.join( '' ),
        content = 'define(' +
                  '[ \'jquery\' ], function ( jQuery ) {\n' +
                   content +
                   '\n});';

    fs.writeFileSync( inDir + '/bootstrap/bootstrap.js', content );
};

/**
 * Converts the contents of a file to an AMD module.
 * @param {String} contents the file contents.
 */
function convert( fileName, contents ) {

    var moduleName, outFileName, i, segment,
        fileParts = fileName.split( '-' ),
        files = getDependencies( fileName ),
        tempDir = inDir;

    //Remove 'bootstrap' prefix from the files,
    //generate module name.
    if ( fileParts[0].indexOf( 'bootstrap' ) !== -1 ) {
        outFileName = fileParts[ 1 ];
    } else {
        outFileName = fileName;
    };

    //Make sure directories exist in the bootstrap section.
    if ( moduleName !== 'bootstrap' && fileParts.length > 1 ) {
        for ( i = 0; i < fileParts.length - 1; i++ ) {
            segment = fileParts[ i ];
            tempDir += segment + '/';
            mkDir( tempDir );
        };
    };

    contents = 'define(' +
        '[ ' + files.join(',') + ' ], function ( jQuery ) {\n' +
        contents +
        '\n});';

    fs.writeFileSync( tempDir + outFileName, contents );
};

function getDependencies( fileName ) {
    var deps;

    if ( optionKey !== '--no-transition' ) {
        switch ( fileName ) {
            case 'bootstrap-transition.js':
                deps = [ "'jquery'" ];
                break;
            case 'bootstrap-popover.js':
                deps = [ "'jquery', './tooltip', './transition'" ];
                break;
            default:
                deps = [ "'jquery', './transition'" ];
                break;
        };        
    } else {
        fileName === 'bootstrap-popover.js' ?
            deps = [ "'jquery', './tooltip'" ] : deps = [ "'jquery'" ];
    };

    return deps;
};