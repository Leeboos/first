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
    var handlers;

    handlers = {};

    function when(namespace, callback){
        // bind a callback function to be called when the given namespace is
        // gived
        if (handlers[namespace]){
            handlers[namespace].push(callback);
        } else {
            handlers[namespace] = [callback];
        }
    }

    function _handle(parts, i){
        // give a list of namespace parts and an index to slice to, handle
        // the namespace formed by joining the parts
        var namespace;
        namespace = parts.slice(0, i).join('.');
        handle(namespace);
    }

    function handle(namespace){
        // call all the callback functions attached to a namespace
        var callback, i, len;
        len = handlers[namespace] ? handlers[namespace].length : 0;
        for (i=0; i<len; i++){
            callback = handlers[namespace][i];
            callback();
        }
    }

    function give(namespace, object){
        // give namespace as object
        var parts, part, i, obj, count;
        parts = parse(namespace);
        obj = window;
        count = parts.length-1;
        for (i=0; i<count; i++){
            part = parts[i];
            if (obj[part]) {
                obj = obj[part];
            } else {
                obj = obj[part] = {};
                _handle(parts, i+1);
            }
        }
        part = parts[i];
        obj[part] = object;
        handle(namespace);
    }

    function parse(words){
        // return ['foo', 'bar', 'baz'] for 'foo.bar.baz'
        return words.split('.');
    }

    window.when = when;
    window.give = give;
})();
