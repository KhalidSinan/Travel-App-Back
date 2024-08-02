const { validationErrors } = require('../../../middlewares/validationErrors');
const { getChat, postChat, getChats, getChatsCount, getChatByTripID, postChatMessage } = require('../../../models/chats.model');
const { getOrganizedTripReservationsForOneTrip } = require('../../../models/organized-trip-reservations.model');
const { getOneOrganizedTrip } = require('../../../models/organized-trips.model');
const { getOrganizerID } = require('../../../models/organizers.model');
const { getPagination } = require('../../../services/query');
const { serializedData } = require('../../../services/serializeArray');
const { getUsersID, getMessageSender } = require('./chat.helper');
const { chatData, chatDetailsData } = require('./chat.serializer');
const { validateCreateChat, validateSendMessage } = require('./chat.validation');

// Done
async function httpGetAllChats(req, res) {
    req.query.limit = 10;
    const { skip, limit } = getPagination(req.query)
    const user_id = req.user._id
    const chats = await getChats(user_id, skip, limit)
    const count = await getChatsCount(user_id)
    return res.status(200).json({
        data: serializedData(chats, chatData),
        count: count
    })
}


// Done
async function httpPostChat(req, res) {
    const { error } = validateCreateChat(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })
    const trip_id = req.params.id
    const organized_trip = await getOneOrganizedTrip(trip_id)
    if (!organized_trip) return res.status(400).json({ message: 'Organized Trip Not Found' })
    if (!organized_trip.trip_id.user_id.equals(req.user._id)) return res.status(400).json({ message: 'Not Authorized To Create A Chat Group For This Trip' })
    const checkChat = await getChatByTripID(trip_id)
    if (checkChat) return res.status(400).json({ message: 'Chat Already Exists' })
    const organizer = await getOrganizerID(req.user._id)
    const organizer_id = organizer._id
    const trip_reservations = await getOrganizedTripReservationsForOneTrip(trip_id);
    const users_id = getUsersID(trip_reservations, req.user._id)
    const name = req.body.chat_name
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
    httpPostChat,
}