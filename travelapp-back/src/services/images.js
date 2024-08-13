var path = require('path');
const fs = require('fs')

function encodeImage(image) {
    const imageBuffer = Buffer.from(image, 'base64');
    const imageName = `chat_${Date.now()}.png`;
    const imagePath = path.join(__dirname, '../public', imageName);

    fs.writeFileSync(imagePath, imageBuffer);

    return imageName;
}

module.exports = { encodeImage }