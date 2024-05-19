function validationErrors(errors) {
    let data = {};
    errors.forEach(error => {
        if (!data[error.path[0]]) {
            data[error.path[0]] = [error.message];
        } else {
            data[error.path[0]].push(error.message);
        }
    });
    return data;
}

module.exports = {
    validationErrors
}

//Alesar
// function validationErrors(errors) {
//   let data = {};
//   errors.array.forEach((error) => {
//     if (!data[error.path[0]]) {
//       data[error.path[0]] = [error.message];
//     } else {
//       data[error.path[0]].push(error.message);
//     }
//   });
//   return data;
// }

// module.exports = {
//   validationErrors,
// };
