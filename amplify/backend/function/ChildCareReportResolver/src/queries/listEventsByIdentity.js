/* eslint-disable */
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { participationByParticipant, eventsByCalendar } = require('../modules/appsync/graphql/queries.js')
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  listEventsByIdentity: async (ctx) => {
    console.log('#CTX-listEventsByIdentity', ctx)
    try {
      // get identity of user
      const identity = ctx.identity.sub;
      // get data from input
      const startDate = ctx.arguments.input.startDate;
      const endDate = ctx.arguments.input.endDate;

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
        const eventsResponse = await request(eventsByCalendar, 'EventsByCalendar', { calendarEventsId: calendar, startDate: { between: [startDate, endDate] } }, appsyncUrl);
        events = events.concat(eventsResponse.data.eventsByCalendar.items)
      }

      return JSON.stringify(events)
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Could not find events`, err)
    }
  }
}