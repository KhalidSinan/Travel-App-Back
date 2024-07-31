const User = require("../../models/users.mongo");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

async function getRandomOrganizer() {
    await mongoConnect()
    const count = await User.countDocuments({ is_organizer: true })
    const skip = Math.floor(Math.random() * count)
    const organizer = await User.find({ is_organizer: true }).skip(skip).limit(1);
    console.log('Email is : ' + organizer[0].email)
    await mongoDisconnect()
}

getRandomOrganizer().catch(err => console.log(err))