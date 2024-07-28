const Admins = require('../models/admins.mongo');

async function createAdmins() {
    const admins = [
        { username: 'elonMusk-22', password: '123123123', role: 'Super-Admin' },
        { username: 'ErenYeager', password: '123123123', role: 'Reports-Admin' },
        { username: 'Rick!Grimes', password: '123123123', role: 'Announcements-Admin' },
        { username: 'Leuloch', password: '123123123', role: 'Notifications-Admin' },
        { username: 'SaulG00DMAN', password: '123123123', role: 'Organizers-Admin' },
    ]

    await Admins.create(admins)
}

module.exports = {
    createAdmins
}