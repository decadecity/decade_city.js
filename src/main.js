require(['test'], function(isLoaded) {
    // The argument passed through is the returned value from the function definition we defined inside App/people.js
    // In this case it was an object literal with two properties: 'list' & 'scripts'
    // If we had specified two dependancies then we'd pass through a second argument which again would be the return'ed value from that module

    console.log(isLoaded);
});
