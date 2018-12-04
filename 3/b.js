var fs = require('fs');

// Function for transforming claim string input into object representation
var parseClaim = input => {
    var values = input.match('^#(\\d+) @ (\\d+),(\\d+): (\\d+)x(\\d+)$');
    var result = {};
    result.id = parseInt(values[1], 10);
    result.left = parseInt(values[2], 10);
    result.right = result.left + parseInt(values[4], 10);
    result.top = parseInt(values[3], 10);
    result.bottom = result.top + parseInt(values[5], 10);
    return result;
};

// Check if there is intersection between specified claims
var checkIntersection = (first, second) => {
    return !(
        first.left > second.right ||
        first.right < second.left ||
        first.top > second.bottom ||
        first.bottom < second.top
    );
};

// Do actual parsing of input claims 
var claims = fs.readFileSync('input.dat', 'utf-8').
        split('\n').filter(value => !!value).
        reduce((result, input) => {
            result.push(parseClaim(input));
            return result;
        }, []);

// Resolve claim with no intersection
var result = claims.find(first => {
    return claims.filter(second => first !== second).
            every(second => !checkIntersection(first, second));
});
console.log('Result:', result.id);