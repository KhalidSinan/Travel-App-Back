function organizerRequestsData(request) {
    return {
        id: request._id,
        user_name: request.user_id.name.first_name + ' ' + request.user_id.name.last_name,
        company_name: request.company_name,
        personal_picture: request.proofs.personal_picture,
    }
}

function organizerRequestDetailsData(request) {
    const age = (Date.now() - request.user_id.date_of_birth) / 1000 / 60 / 60 / 24 / 365
    return {
        id: request._id,
        user_name: request.user_id.name.first_name + ' ' + request.user_id.name.last_name,
        company_name: request.company_name,
        // profile_pic: request.user_id.profile_pic,
        location: request.user_id.location.city + ', ' + request.user_id.location.country,
        gender: request.user_id.gender,
        phone_number: '+' + request.user_id.phone.country_code + ' ' + request.user_id.phone.number,
        age: age.toFixed(0),
        years_of_experience: request.years_of_experience,
        previous_companies: request.proofs.companies_worked_for,
        personal_id: request.proofs.personal_id,
        personal_picture: request.proofs.personal_picture,
        work_id: request.proofs.work_id,
        last_certificate: request.proofs.last_certificate,
    }
}

module.exports = {
    organizerRequestsData,
    organizerRequestDetailsData
}