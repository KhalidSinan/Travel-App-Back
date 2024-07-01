const { validationErrors } = require('../../../middlewares/validationErrors')
const { getAnnouncementRequest, getAnnouncementRequests, acceptAnnouncementRequest, denyAnnouncementRequest } = require('../../../models/announcement-requests.model')


async function httpGetAllAnnouncementRequests(req, res) {
    const data = await getAnnouncementRequests()
    return res.status(200).json({
        message: 'Announcement Requests Retrieved Successfully',
        data: data
    })
}
async function httpGetOneAnnouncementRequest(req, res) {
    const data = await getAnnouncementRequest(req.params.id)
    return res.status(200).json({
        message: 'Announcement Request Retrieved Successfully',
        data: data
    })
}
async function httpAcceptAnnouncementRequest(req, res) {
    const data = await acceptAnnouncementRequest(req.params.id)
    return res.status(200).json({
        message: 'Announcement Request Accepted Successfully',
        data: data
    })
}
async function httpDenyAnnouncementRequest(req, res) {
    const data = await denyAnnouncementRequest(req.params.id)
    return res.status(200).json({
        message: 'Announcement Request Denied Successfully',
        data: data
    })
}


module.exports = {
    httpGetAllAnnouncementRequests,
    httpGetOneAnnouncementRequest,
    httpAcceptAnnouncementRequest,
    httpDenyAnnouncementRequest,
}