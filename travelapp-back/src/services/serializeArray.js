function serializedData(data, serializer) {
    let serializedData = [];
    data.forEach(each => serializedData.push(serializer(each)));
    return serializedData;
}

module.exports = {
    serializedData
}