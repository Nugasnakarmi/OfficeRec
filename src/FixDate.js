export default function fixDate(date) {
    
    if(typeof(date) !== 'string')
        { 
        var currentDate;
    var dateHolder = date.toDate();
    currentDate = dateHolder;
    var day = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    function ordinal(i) {
        var j = i % 10,
            k = i % 100;
        if (j === 1 && k !== 11) {
            return i + "st";
        }
        if (j === 2 && k !== 12) {
            return i + "nd";
        }
        if (j === 3 && k !== 13) {
            return i + "rd";
        }
        return i + "th";
    }
    // var mmddyyyy = pad(month + 1) + "/" + pad(day) + "/" + year;
    var monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    //   var dateWithFullMonthName = monthNames[month] + " " + pad(date) + ", " + year;
    var ordinalDate = ordinal(day) + " " + monthNames[month] + ", " + year;
    return ordinalDate;
}
else{
    console.log( "is string");
    return date;
}
}
