/**
 * Created by anujparikh on 1/3/17.
 */
exports.getDateFromString = function (date) {
    return new Date(parseInt(date.substring(6,10)), parseInt(date.substring(0,2)) - 1, parseInt(date.substring(3,5)));
};