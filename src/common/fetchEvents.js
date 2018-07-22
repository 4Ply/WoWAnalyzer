import fetchWcl from 'common/fetchWclApi';

const timeAvailable = console.time && console.timeEnd;

function fetchEventsPage(code, start, end, actorId = undefined, filter = undefined) {
  return fetchWcl(`report/events/${code}`, {
    start,
    end,
    actorid: actorId,
    filter,
    translate: true, // it's better to have 1 consistent language so long as we don't have the entire site localized
  });
}

export default async function fetchEvents(reportCode, fightStart, fightEnd, actorId = undefined, filter = undefined) {
  let pageStartTimestamp = fightStart;

  let events = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    timeAvailable && console.time('API/events');
    // eslint-disable-next-line no-await-in-loop
    const json = await fetchEventsPage(reportCode, pageStartTimestamp, fightEnd, actorId, filter);
    timeAvailable && console.timeEnd('API/events');
    events = [
      ...events,
      ...json.events,
    ];
    if (json.nextPageTimestamp) {
      if (json.nextPageTimestamp > fightEnd) {
        console.error('nextPageTimestamp is after fightEnd, do we need to manually filter too?');
      }
      pageStartTimestamp = json.nextPageTimestamp;
    } else {
      break;
    }
  }
  return events;
}
