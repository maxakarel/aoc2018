var fs = require('fs');

// Transform claim string into object representation
var parseClaim = claim => {
    var values = claim.match('^#(\\d+) @ (\\d+),(\\d+): (\\d+)x(\\d+)$');
    return {
        id: parseInt(values[1], 10),
        left: parseInt(values[2], 10),
        right: parseInt(values[2], 10) + parseInt(values[4], 10),
        top: parseInt(values[3], 10),
        bottom: parseInt(values[3], 10) + parseInt(values[5], 10)
    };
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

// Parse input claims 
var claims = fs.readFileSync('input.dat', 'utf-8').
        split('\n').
        filter(value => !!value).
        reduce((result, claim) => {
            result.push(parseClaim(claim));
            return result;
        }, []);

// Resolve claim with no intersection
var result = claims.find(first => {
    return claims.
            filter(second => first !== second).
            every(second => !checkIntersection(first, second));
});
console.log('Result:', result.id);