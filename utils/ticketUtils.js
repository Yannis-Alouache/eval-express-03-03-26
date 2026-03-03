const { Ticket } = require("../models/Ticket")
const { User } = require("../models/User")

/**
 *
 * @type {Map<string, {next: string, roles: string[]}>}
 */
const statusMap = new Map([
    ['open', { next: 'assigned', roles: ['support'] }],
    ['assigned', { next: 'in_progress', roles: ['support'] }],
    ['in_progress', { next: 'resolved', roles: ['support'] }],
    ['resolved', { next: 'closed', roles: ['support', 'collaborateur'] }],
])

/**
 * Can the ticket pass to the given status.
 * @param {string} newStatus
 * @param {Ticket} ticket
 * @param {User} user
 */
const canTicketPassToStatus = (newStatus, ticket, user) => {
    const currentStatus = ticket.status;

    if( !currentStatus ) {
        return false
    }


    if( 'cancelled' === newStatus && 'open' === ticket.status && ticket.isUserAuthor(user) ) {
        return true;
    }

    //get the current status map
    const currentMapItemStatus = statusMap.get(currentStatus)

    if( !currentMapItemStatus ) {
        return false;
    }

    // if the role is not the next role
    if( newStatus !== currentMapItemStatus.next ) {
        return false
    }

    //if the user can change to this status
    return currentMapItemStatus.roles.includes(user.role);
}

module.exports = {
    canTicketPassToStatus,
}