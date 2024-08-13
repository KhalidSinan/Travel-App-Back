
const { faker } = require('@faker-js/faker')
const { checkChat, getChat, getOneChat } = require('../../../models/chats.model')
const { getOneOrganizedTrip } = require('../../../models/organized-trips.model')

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

function sortChatsByType(chats, filter) {
    if (filter == "Present") {
        chats = chats.filter(chat => {
            return chat.trip_id.trip_id.start_date < new Date() && new Date() < chat.trip_id.trip_id.end_date
        })
    }
    else if (filter == "Past") {
        chats = chats.filter(chat => {
            return new Date() > chat.trip_id.trip_id.end_date
        })
    }
    return chats
}

async function getJoinableChats(organized_trips_ids, user_id) {
    let joinableChats = []
    for (const trip of organized_trips_ids) {
        const chat = await checkChat(trip._id, user_id)
        if (!chat) {
            joinableChats.push(
                await getOneChat(trip._id)
            )
        }
    }
    return joinableChats
}


module.exports = {
    getUsersID,
    checkMessageFromWho,
    assignColorToUser,
    createUserData,
    sortChatsByType,
    getJoinableChats
}