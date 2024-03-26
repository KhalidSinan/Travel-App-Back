function handleErrors(err) {
    const errors = {};

    console.log(err)
    if (err.code === 11000) {
        field = (Object.keys(err.keyPattern));
        errors[field] = field + ' already being used';
        return errors;
    }

    Object.values(err.errors).forEach((error) => {
        errors[error.properties.path] = error.properties.message
    });
    return errors;
}

module.exports = {
    handleErrors
}