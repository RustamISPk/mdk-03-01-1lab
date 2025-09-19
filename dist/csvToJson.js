"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvToJson = void 0;
var fs = require("fs");
var Papa = require("papaparse");
var dateTime_1 = require("./utils/dateTime");
// Relationship map to dynamically extract/set relative relations
var RELATION_MAP = {
    Father: 'Father',
    Mother: 'Mother',
    Brother: 'Brother',
    Sister: 'Sister',
};
function csvToJson(csv) {
    // Create final list of extracted people and their metadata
    var people = [];
    // Parse csv data
    var data = Papa.parse(csv, { header: true }).data;
    // Iterate through each person's metadata
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var row = data_1[_i];
        // Initialize new relatives for each person
        var relatives = [];
        // Only iterate through relationship columns
        for (var column in RELATION_MAP) {
            var entry = row[column];
            // If entry is valid, save relationship entry
            if (entry !== 'null' && entry !== null) {
                var relativeName = entry.split(' ');
                relatives.push({
                    // firstName will always be first
                    firstName: relativeName[0],
                    // lastName will always be last
                    lastName: relativeName[relativeName.length - 1],
                    // Look up respective relationship
                    relationship: column,
                });
            }
        }
        var personName = row.Name.split(' ');
        var person = {
            // firstName will always be first
            firstName: personName[0],
            // lastName will always be last
            lastName: personName[personName.length - 1],
            birthday: (0, dateTime_1.formatDate)(row.Birthday),
            age: (0, dateTime_1.calculateAge)(row.Birthday, row.Died),
            relatives: relatives,
        };
        // Push to cumulated list of people
        people.push(person);
    }
    return people;
}
exports.csvToJson = csvToJson;
function main() {
    // Get command-line arguments
    var args = process.argv;
    // Console error if no files specified
    if (args.length < 4) {
        console.error('Invalid input: npm run start <inputFile> <outputFile>');
        process.exit(1);
    }
    // Get file paths from argv
    var inputFilePath = args[args.length - 2];
    var outputFilePath = args[args.length - 1];
    // Console error if inputFilePath does not exist
    if (!fs.existsSync(inputFilePath)) {
        console.error("Input file path cannot be found");
        process.exit(1);
    }
    var csv = fs.readFileSync(inputFilePath, 'utf8');
    // Convert .csv to .json
    var json = csvToJson(csv);
    // Write the JSON data to a file
    fs.writeFileSync(outputFilePath, JSON.stringify(json, null, 2));
}
exports.default = main;
