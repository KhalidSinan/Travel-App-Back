function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return [hours, minutes]
}

function convertToTimeFormat(minutes) {
    let hours = Math.floor(minutes / 60);
    let newMinutes = minutes % 60
    newMinutes = newMinutes.toString()
    hours = hours.toString()
    if (newMinutes.length == 1) newMinutes = '0' + newMinutes
    if (hours.length == 1) hours = '0' + hours
    return hours + ':' + newMinutes
}

function createDateTimeObject(date, time) {
    const temp = new Date(date)
    temp.setTime(temp.valueOf() + 3 * 60 * 60 * 1000) // To Fix Timezones
    time = convertTime12to24(time)
    temp.setUTCHours((Number)(time[0]) - 3, time[1])
    return temp;
}

function msToTime(remaining) {
    let seconds = Math.floor(remaining / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    return { days, hours, minutes, seconds }
}

module.exports = { convertTime12to24, convertToTimeFormat, createDateTimeObject, msToTime }
