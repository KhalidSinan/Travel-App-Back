const { getChat, postChat, getChats, getChatsCount } = require('../../../models/chats.model');
const { getOrganizedTripReservationsForOneTrip } = require('../../../models/organized-trip-reservations.model');
const { getOneOrganizedTrip } = require('../../../models/organized-trips.model');
const { getOrganizerID } = require('../../../models/organizers.model');
const { getPagination } = require('../../../services/query');

// Done
async function httpGetAllChats(req, res) {
    req.query.limit = 10;
    const { skip, limit } = getPagination(req.query)
    const user_id = req.user._id
    const chats = await getChats(user_id, skip, limit)
    const count = await getChatsCount(user_id)
    return res.status(200).json({
        data: chats,
        count: count
    })
}

async function httpGetOneChat(req, res) {
    const chatID = req.params.id
    const chat = await getChat(chatID)
    return chat
}

async function httpPostChat(req, res) {
    const organized_trip = await getOneOrganizedTrip(trip_id)
    if (!organized_trip.trip_id.user_id.equals(req.user._id)) {
        return res.status(400).json({
            message: 'Not Authorized To Create A Chat Group For This Trip'
        })
    }
    const organizer = await getOrganizerID(req.user._id)
    const organizer_id = organizer._id
    const trip_id = req.params.id
    const users_id = await getOrganizedTripReservationsForOneTrip(trip_id);
    console.log(user_id)
    const name = req.body.name
    const data = {
        organizer_id,
        users_id,
        trip_id,
        name
    }
    await postChat(data)
    return res.status(200).json({ message: 'Chat Successfully Created' })
}


module.exports = {
    httpGetAllChats,
    httpGetOneChat,
    httpPostChat
}