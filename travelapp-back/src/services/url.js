function isAbsoluteURL(url) {
    return /^https?:\/\//i.test(url);
}

module.exports = {
    isAbsoluteURL
}