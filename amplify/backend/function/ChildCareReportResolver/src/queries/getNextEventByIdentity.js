/* eslint-disable */
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { participationByParticipant, eventsByCalendar } = require('../modules/appsync/graphql/queries.js')
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  getNextEventByIdentity: async (ctx) => {
    console.log('#CTX-getNextEventByIdentity', ctx)
    try {
      // get identity of user
      const identity = ctx.identity.sub;

      // get all participations of calendar from AppSync
      const participationsResponse = await request(participationByParticipant, 'ParticipationByParticipant', { participant: identity }, appsyncUrl);
      console.log('#R-participationsResponse', participationsResponse);
      const participations = participationsResponse.data.participationByParticipant.items;
      console.log('#participations', participations);

      // get array of unique relevant calendars
      var calendars = []
      for (const participation of participations) {
        if (calendars.indexOf(participation.calendar.id) < 0) {
          calendars.push(participation.calendar.id)
        }
      }
      console.log('#-calendars', calendars)

      // create empty events array
      var events = []
      // get all events by calendar and save events
      for (const calendar of calendars) {
        const eventsResponse = await request(eventsByCalendar, 'EventsByCalendar', { calendarEventsId: calendar, startDate: { gt: new Date() } }, appsyncUrl);
        events = events.concat(eventsResponse.data.eventsByCalendar.items)
      }

      // find the earliest occuring date
      var selectedEvent = events[0]
      for (const event of events) {
        if (Date.parse(selectedEvent.startDate) > Date.parse(event.startDate)) {
          selectedEvent = event
        }
      }

      return JSON.stringify(selectedEvent)
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Could not find nearest event`, err)
    }
  }
}