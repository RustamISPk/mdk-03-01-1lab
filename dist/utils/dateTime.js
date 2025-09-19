"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = exports.formatDate = void 0;
// Converts 'M/D/YYYY' to 'YYYY-MM-DD' format
function formatDate(dateString) {
    var _a = dateString.split('/'), month = _a[0], day = _a[1], year = _a[2];
    var formattedMonth = month.padStart(2, '0');
    var formattedDay = day.padStart(2, '0');
    return "".concat(year, "-").concat(formattedMonth, "-").concat(formattedDay);
}
exports.formatDate = formatDate;
// Calculates age by using the current date, or death date, whichever comes first
function calculateAge(birthday, deathday) {
    var birthDate = new Date(birthday);
    var deathDate = new Date(deathday);
    var today = new Date();
    // Determines whether to use deathdate or today's date
    var finalDate = deathDate instanceof Date && !isNaN(deathDate.getTime()) ? deathDate : today;
    var month = finalDate.getMonth() - birthDate.getMonth();
    var age = finalDate.getFullYear() - birthDate.getFullYear();
    // Check if user aged or not this year
    if (month < 0 || (month === 0 && finalDate.getDate() < birthDate.getDate())) {
        age -= 1;
    }
    return age;
}
exports.calculateAge = calculateAge;
