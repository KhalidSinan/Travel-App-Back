const { isAbsoluteURL } = require("../../../services/url");

function organizerRequestsData(request) {
    const personal_picture = request.proofs.personal_picture
    return {
        id: request._id,
        organizer_name: request?.user_id?.name?.first_name + ' ' + request?.user_id?.name.last_name,
        company_name: request.company_name,
        personal_picture: isAbsoluteURL(personal_picture) ? personal_picture : process.env.WEB_URL + '/' + personal_picture,
    }
}

function organizerRequestDetailsData(request) {
    let age = 'Organizer didnt Provide an Age'
    if (request.user_id.date_of_birth) {
        age = (Date.now() - request.user_id.date_of_birth) / 1000 / 60 / 60 / 24 / 365
        age = age.toFixed(0)
    }
    const previous_companies = request.proofs.companies_worked_for.join(' - ')
    let phone = 'Organizer didnt Provide a Phone Number'
    if (request.user_id.phone) phone = '+' + request.user_id.phone.country_code + ' ' + request.user_id.phone.number
    const personal_picture = request.proofs.personal_picture
    return {
        id: request._id,
        organizer_name: request.user_id.name.first_name + ' ' + request.user_id.name.last_name,
        company_name: request.company_name,
        personal_picture: isAbsoluteURL(personal_picture) ? personal_picture : process.env.WEB_URL + '/' + personal_picture,
        location: request.user_id.location.city + ', ' + request.user_id.location.country,
        gender: request.user_id.gender,
        phone_number: phone,
        age: age,
        years_of_experience: request.years_of_experience,
        previous_companies: previous_companies,
        proofs: proofData(request.proofs),

    }
}

function proofData(proof) {
    const work_id = proof.work_id
    const personal_id = proof.personal_id
    const last_certificate = proof.last_certificate
    return [
        { name: "work_id", picture: isAbsoluteURL(work_id) ? work_id : process.env.WEB_URL + '/' + proof.work_id },
        { name: "personal_id", picture: isAbsoluteURL(personal_id) ? personal_id : process.env.WEB_URL + '/' + proof.personal_id },
        { name: "last_certificate", picture: isAbsoluteURL(last_certificate) ? last_certificate : process.env.WEB_URL + '/' + proof.last_certificate },
    ];
}

module.exports = {
    organizerRequestsData,
    organizerRequestDetailsData
}