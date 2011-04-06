when.js is a a simple javascript namespace loader and requirements handler

Why
===
    when.js removes the need to require JavaScripts in order.  It allows you to write more modular code and write
    with graceful degradation in mind.


A simple example
----------------
    // when window.foo is availabe
    when('foo', function(){
        alert('foo is available');
    });

    // when window.foo.bar is available
    when('foo.bar', function(){
        alert('foo.bar is available');
    });

    // when window.foo.bar.baz is available
    when('foo.bar.baz', function(){
        alert('foo.bar.baz is available');
    });

    // window.foo, window.foo.bar, window.foo.bar.baz all become available,
    // in that order
    give('foo.bar', {
        baz: true
    });


Loading JavaScript libraries
----------------------------
    // load jQuery and notify any handlers that the 'jQuery' namespace
    // is available when the script has been evaluated
    load('jQuery', '/static/js/jquery.js');

    // when the jQuery namespace is available, attach an event handler to the
    // DOM ready event that alerts "DOM is ready"
    when('jQuery', function(){
        $(function(){
            alert('DOM is ready');
        });
    })

Loading models, and graceful degradation
----------------------------------------
    // make a call to your RESTful api to get some user info
    load('myapp.current_user', '/users/11');

    when('myapp.current_user.is_admin', function(){
        // this code only runs if the current user is an admin
    });

License
-------
    BSD, see the included LICENSE file

Homepage
--------
    http://github.com/elijahr/when.js
