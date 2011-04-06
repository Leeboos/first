when.js is a simple javascript namespace loader and requirements handler

Why
===
when.js makes it so that you don't have to worry about including your JavaScript
scripts in order.  It allows you to write more modular code and write with
graceful degradation in mind.

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

    // this is the same as
    // window.foo = {
    //    bar: {
    //        baz: true
    //    }
    // }
    // but will also call the callbacks we set with the when function: 'foo',
    // 'foo.bar', and 'foo.bar.baz'
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

Loading models, graceful degradation, and logic
-----------------------------------------------
    // make a call to your RESTful API to get some user info
    grab('myapp.current_user', '/users/11');

    when('myapp.current_user.is_admin', true, function(){
        // this code only runs if the current user's is_admin proeprty is true
    });

    when('myapp.current_user.is_admin', false, function(){
        // this code only runs if the current user's is_admin proeprty is false
    });

License
-------
    BSD, see the included LICENSE file

Homepage
--------
    http://github.com/elijahr/when.js
