/* eslint-disable */
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { participationByCalendar, eventsByCalendar } = require('../modules/appsync/graphql/queries.js')
const { deleteParticipation, deleteEvent, deleteCalendar } = require('../modules/appsync/graphql/mutations.js')
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  adminDeleteCalendar: async (ctx) => {
    console.log('#CTX-adminDeleteCalendar', ctx)
    try {
      // get id of about to be deleted calendar
      const calendarId = ctx.arguments.input.id;

      // get all participations of calendar from AppSync
      const participationsResponse = await request(participationByCalendar, 'ParticipationByCalendar', { calendarParticipationsId: calendarId }, appsyncUrl);
      console.log('#R-participationsResponse', participationsResponse);
      const participations = participationsResponse.data.participationByCalendar.items;
      console.log('#participations', participations);

      // iterate all participations and delete them
      for (const participation of participations) {
        await request(deleteParticipation, 'DeleteParticipation', { input: { id: participation.id } }, appsyncUrl);
      }

      // get all events of calendar from AppSync
      var eventToken = null;
      var events = [];
      // pull events until no more can be pulled
      do {
        // get event via store
        const eventsResponse = await request(eventsByCalendar, 'EventsByCalendar', { calendarEventsId: calendarId }, appsyncUrl);
        // push to events array
        events = events.concat(eventsResponse.data.eventsByCalendar.items);
        // get nextToken
        eventToken = eventsResponse.data.eventsByCalendar.nextToken;
      } while (eventToken !== null)

      // iterate all events and delete them
      for (const event of events) {
        await request(deleteEvent, 'DeleteEvent', { input: { id: event.id } }, appsyncUrl);
      }

      // finally delete the calendar itself
      const calendarDelteResp = await request(deleteCalendar, 'DeleteCalendar', { input: { id: calendarId } }, appsyncUrl);
      return calendarDelteResp
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Deletion was not successful`, err)
    }
  }
}