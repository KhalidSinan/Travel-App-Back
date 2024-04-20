function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes, seconds] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return [hours, minutes, seconds]
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

module.exports = { convertTime12to24, convertToTimeFormat }
