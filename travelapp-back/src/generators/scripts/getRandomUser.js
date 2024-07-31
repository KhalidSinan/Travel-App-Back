const User = require("../../models/users.mongo");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

async function getRandomUser() {
    await mongoConnect()
    const count = await User.countDocuments({ is_organizer: false })
    const skip = Math.floor(Math.random() * count)
    const user = await User.find({ is_organizer: false }).skip(skip).limit(1);
    console.log('Email is : ' + user[0].email)
    await mongoDisconnect()
}

getRandomUser().catch(err => console.log(err))