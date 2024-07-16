function organizerRequestsData(request) {
    return {
        id: request._id,
        organizer_name: request.user_id.name.first_name + ' ' + request.user_id.name.last_name,
        company_name: request.company_name,
        profile_pic: process.env.URL + request.proofs.personal_picture,
    }
}

function organizerRequestDetailsData(request) {
    const age = (Date.now() - request.user_id.date_of_birth) / 1000 / 60 / 60 / 24 / 365
    const previous_companies = request.proofs.companies_worked_for.join(' - ')
    return {
        id: request._id,
        user_name: request.user_id.name.first_name + ' ' + request.user_id.name.last_name,
        company_name: request.company_name,
        profile_pic: process.env.URL + request.proofs.personal_picture,
        location: request.user_id.location.city + ', ' + request.user_id.location.country,
        gender: request.user_id.gender,
        phone_number: '+' + request.user_id.phone.country_code + ' ' + request.user_id.phone.number,
        age: age.toFixed(0),
        years_of_experience: request.years_of_experience,
        previous_companies: previous_companies,
        proofs: proofData(request.proofs),

    }
}

function proofData(proof) {
    return [
        { name: "work_id", picture: process.env.URL + proof.work_id },
        { name: "personal_id", picture: process.env.URL + proof.personal_id },
        { name: "last_certificate", picture: process.env.URL + proof.last_certificate },
    ];
}

module.exports = {
    organizerRequestsData,
    organizerRequestDetailsData
}