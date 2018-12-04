var fs = require('fs');
var _ = require('lodash');

// Resolve ID for specified record message 
var resolveId = (message, currentId) => {
    var match = message.match('^Guard #(\\d+) begins shift$');
    if (match) {
        return match[1];
    }
    return currentId;
};

// Read input file content
var content = fs.readFileSync('input.dat', 'utf-8');
var id = null;
// Parse input records and group them by IDs
var records = _(content.split('\n')).compact().
        map(entry => {
            return {
                date: entry.substring(1, 17),
                message: entry.substring(19)
            };
        }).
        sortBy('date').
        reduce((result, record) => {
            // Resolve ID for current record
            id = resolveId(record.message, id);
            if (!result[id]) {
                result[id] = [];
            } else if (!record.message.startsWith('Guard')) { // Store only sleep-related records
                result[id].push(record);
            }
            return result;
        }, {});
// Resolve minute counts for all guard sleep-related records 
var processed = Object.keys(records).map(id => {
    return _.chunk(records[id], 2).reduce((result, pair) => {
        let startDate = new Date(pair[0].date);
        let endDate = new Date(pair[1].date);
        for (let minute = startDate.getMinutes();minute < endDate.getMinutes();minute++) {
            if (!result.minutes[minute]) {
                result.minutes[minute] = 0;
            }
            result.minutes[minute]++;
            result.count++;
        }
        return result;
    }, {
        minutes: {},
        count: 0,
        id: id
    });
});
// Resolve period with maximal minute occurence
var maximalPeriod = _(processed).maxBy(record => {
    return _.max(_.values(record.minutes));
});
// Find maximal sleeping minute
var minute = _(Object.keys(maximalPeriod.minutes)).maxBy(minute => {
    return maximalPeriod.minutes[minute];
});
// Print results
console.log('ID:', maximalPeriod.id);
console.log('Minute:', minute);
console.log('Result:', parseInt(maximalPeriod.id, 10) * parseInt(minute, 10));
