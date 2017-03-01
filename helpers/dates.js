var datesHelper = {
    daysBetween : function (olderDate, newestDay) {
        var diff = Math.abs(newestDay.getTime() - olderDate.getTime());
        return diff / (1000 * 60 * 60 * 24);
    },
    substractHours: function(date, hours){
        return date.setHours(date.getHours(), hours);
    }
};

module.exports = datesHelper;
