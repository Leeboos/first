// when,js
// a simple javascript namespace requirements handler
// http://github.com/elijahr/when.js

/*
    Copyright (c) 2011, Elijah Rutschman
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
        * Redistributions of source code must retain the above copyright
          notice, this list of conditions and the following disclaimer.
        * Redistributions in binary form must reproduce the above copyright
          notice, this list of conditions and the following disclaimer in the
          documentation and/or other materials provided with the distribution.
        * Neither the name of the <organization> nor the
          names of its contributors may be used to endorse or promote products
          derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function(){
    var handlers, handled;

    handlers = {};
    handled = {};

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

    function getSubNamespaces(namespace){
        // get the sub-namespaces associated  with the namespace
        var subNamespaces, ns;
        namespace = cleanNamespace(namespace);
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

    function give(namespace, object){
        // give namespace as object
        var parts, part, i, obj, count, propertyName, ns, ind, len,
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
        for (i=0; i<len; i++){
            subNamespace = subNamespaces[i];
            handle(subNamespace);
        }
    }

    function parseNamespace(words){
        // return ['foo', 'bar', 'baz'] for 'foo.bar.baz'
        return words.split('.');
    }

    function cleanNamespace(namespace){
        return namespace.replace(/^(window.)*/g, '');
    }

    // export the when & give functions
    give('when', when);
    give('give', give);
})();
