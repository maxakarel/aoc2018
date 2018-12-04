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

// Do actual parsing of input claims 
var claims = fs.readFileSync('input.dat', 'utf-8').
        split('\n').filter(value => !!value).
        reduce((result, claim) => {
            result.push(parseClaim(claim));
            return result;
        }, []);

// Build array with claim intersections
var intersections = claims.reduce((result, claim) => {
    for (var i = claim.left; i < claim.right; i++) {
        for (var j = claim.top; j < claim.bottom; j++) {
            if (!result[i]) { // Missing row
                result[i] = [];
            }
            if (!result[i][j]) { // Missing point
                result[i][j] = 1;
            } else { // Already existing point
                result[i][j]++;
            }
        }
    }
    return result;
}, []);

// Count the result
var count = intersections.reduce((result, row) => {
    return result + row.filter(value => value > 1).length;
}, 0);
console.log('Result:', count);