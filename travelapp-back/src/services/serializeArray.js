function serializedData(data, serializer) {
    let serializedData = [];
    if (data.length > 0)
        data.forEach(each => serializedData.push(serializer(each)));
    return serializedData;
}

module.exports = {
    serializedData
}