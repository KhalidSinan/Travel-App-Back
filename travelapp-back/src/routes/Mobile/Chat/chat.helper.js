
const { faker } = require('@faker-js/faker')

function getUsersID(reservations, organizer_id) {
    let temp = reservations.map(reservation => reservation.user_id)
    temp.push(organizer_id)
    return temp
}

function checkMessageFromWho(message, user_id) {
    if (message.sender_id == user_id) {
        message.from_me = true
    }
    else message.from_me = false
    return message
}

function assignColorToUser(users_id) {
    let data = []
    users_id.forEach(user => {
        const temp = {
            id: user,
            color: faker.color.rgb({ prefix: '0xff' })
        }
        data.push(temp)
    })
    return data
}

function createUserData(user_id) {
    return {
        id: user_id,
        color: faker.color.rgb({ prefix: '0xff' })
    }
}




module.exports = {
    getUsersID,
    checkMessageFromWho,
    assignColorToUser,
    createUserData
}