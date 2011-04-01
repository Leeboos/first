// when,js
// a simple namespace requirements handler

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
