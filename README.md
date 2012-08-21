# bootstrap-amd

This script converts [Twitter Bootstrap JavaScript](http://twitter.github.com/bootstrap/javascript.html) files into
[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) JavaScript modules.

The modules can be loaded by AMD script loaders like [RequireJS](http://requirejs.org).

**Note: this script is a changed [jrburke](https://github.com/jrburke)'s [jqueryui-amd](https://github.com/jrburke/jqueryui-amd).**

## Installing

The script requires nodejs 0.6 to run. Use npm to install it:

    npm install -g bootstrap-amd

## Using

    bootstrap-amd path/to/git-cloned-bootstrap

bootstrap-amd sets `Transitions` module as a dependancy for all modules. If you don't need transitions or want to add them manually, use '--no-transition' key:

    bootstrap-amd path/to/git-cloned-bootstrap --no-transition

##Configuring AMD loading

You can configure the location just like you configure [jqueryui-amd](https://github.com/jrburke/jqueryui-amd#configuring-amd-loading) to reference the modules with a `bootstrap` prefix:

```javascript
define([ 'bootstrap/alert', 'bootstrap/dropdown' ], function() {
    //some code
});
```

## What happens

The script works with Twitter Bootstrap source directory cloned from [github](https://github.com/twitter/bootstrap/). It doesn't clone the Bootstrap, it just expects a path to this directory as a first argument.

bootstrap-amd creates `bootstrap` folder with converted modules in the source directory.

## Constraints

This script assumes a directory for Twitter Bootstrap contains a `js` directory.

Since Twitter doesn't write their dependencies anywhere in the code, they are hardcoded in the script.
