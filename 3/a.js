var fs = require('fs');

// Transform string claim into object representation
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

// Parse input claims 
var claims = fs.readFileSync('input.dat', 'utf-8').
        split('\n').
        filter(value => !!value).
        reduce((result, claim) => {
            result.push(parseClaim(claim));
            return result;
        }, []);

// Build array with claim intersections
var intersections = [];
claims.forEach(claim => {
    for (var i = claim.left; i < claim.right; i++) {
        for (var j = claim.top; j < claim.bottom; j++) {
            if (!intersections[i]) { // Missing row
                intersections[i] = [];
            }
            if (!intersections[i][j]) { // Missing point
                intersections[i][j] = 1;
            } else { // Already existing point
                intersections[i][j]++;
            }
        }
    }
});

// Count the result
var count = intersections.reduce((result, row) => {
    return result + row.filter(value => value > 1).length;
}, 0);
console.log('Result:', count);