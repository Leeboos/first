/*
 * when.js
 * a simple javascript namespace loader and requirements handler
 * http://github.com/elijahr/when.js
 *
 * Copyright 2011, Elijah Rutschman
 * Licensed under the 3-clause BSD license.
 * https://github.com/elijahr/when.js/blob/master/LICENSE
 *
 * Date: 04/05/2011
 */
(function(){
    var handlers, handled, COMPLETE;

    handlers = {};
    handled = {};
    COMPLETE = 4;

    function when(namespace, callback){
        // bind a callback function to be called when the given namespace is
        // provided with 'give'
        namespace = cleanNamespace(namespace);

        try {
            // if this namespace has already been provided, call the callback
            // immediately
            eval('window.'+namespace);
            callback();
        } catch (e) {
            // not available
            if (handlers[namespace]){
                // if this namespace has already been bound to
                handlers[namespace].push(callback);
            } else {
                // if this namespace has not been bound to yet
                handlers[namespace] = [callback];
            }
        }
    }

    function give(namespace, object){
        // give namespace as object
        var parts, part, i, obj, count, propertyName, ns, len,
            subNamespaces, subNamespace;
        namespace = cleanNamespace(namespace);
        obj = window;
        parts = parseNamespace(namespace);
        ns = 'window';
        while(parts.length-1){
            part = parts.splice(0,1);
            if (obj[part]){
                obj = obj[part];
            } else {
                obj = obj[part] = {};
                ns += '.'+part;
                // handle anything outside the object
                handle(ns);
            }
        }

        // provide the object at the namespace
        obj[parts[0]] = object;
        // call any callbacks bound to this namespace
        handle(namespace);

        // handle anything provided inside of object
        subNamespaces = getSubNamespaces(namespace);
        len = subNamespaces.length;
        while (subNamespaces.length){
            ns = subNamespaces.shift();
            handle(ns);
        }
    }

    function load(namespace, url, callback){
        // load and evaluate a script at 'url', then give 'namespace',
        // and if provided, call 'callback'
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            var src;
            if (this.readyState === COMPLETE){
                src = this.responseText;
                if (callback){
                    when(namespace, callback);
                }
                eval(src);
                give(namespace, window[namespace]);
            }
        };
        xhr.open('GET', url);
        xhr.send();
    }

    function handle(namespace){
        // call all the callback functions attached to a namespace
        var callback, i, len;
        namespace = cleanNamespace(namespace);
        len = handlers[namespace] ? handlers[namespace].length : 0;
        for (i=0; i<len; i++){
            callback = handlers[namespace][i];
            callback();
        }
        // keep a reference that this item has already been handled/given
        handled[namespace] = null;
    }

    function getSubNamespaces(namespace){
        // get the sub-namespaces associated  with the namespace
        var subNamespaces, ns;
        subNamespaces = [];
        for (ns in handlers){
            if (handlers.hasOwnProperty(ns)) {
                // if this is a sub-namespace
                if (ns.indexOf(namespace+'.') === 0){
                    subNamespaces.push(ns);
                }
            }
        }
        return subNamespaces;
    }

    function parseNamespace(words){
        // return ['foo', 'bar', 'baz'] for 'foo.bar.baz'
        return words.split('.');
    }

    function cleanNamespace(namespace){
        // turn 'window.foo' into 'foo'
        return namespace.replace(/^(window.)*/g, '');
    }

    // export the when, give, & load functions
    give('when', when);
    give('give', give);
    give('load', load);
})();
