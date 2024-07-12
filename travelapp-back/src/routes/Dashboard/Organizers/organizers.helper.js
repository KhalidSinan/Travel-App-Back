function searchOrganizersHelper(organizers, name) {
    const [firstName, lastName] = name.split(' '); // Use descriptive variable names

    return organizers.filter(organizer => {
        const userFirstName = organizer.user_id.name.first_name;
        const userLastName = organizer.user_id.name.last_name;

        const firstNameMatch = new RegExp(firstName, 'i').test(userFirstName);
        const lastNameMatch = new RegExp(lastName, 'i').test(userLastName);

        return firstNameMatch && lastNameMatch;
    });
}

module.exports = { searchOrganizersHelper }