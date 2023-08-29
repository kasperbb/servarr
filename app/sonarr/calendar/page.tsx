import 'dayjs/locale/en-gb'

import { dayjs } from '@/lib/dayjs';
import { generateCalendar } from '@/lib/dayjs'
import { CalendarSchema } from '@/api/sonarr/schema';
import Calendar from './calendar';
import { fetchSonarr } from '@/api/sonarr/fetch-sonarr';

function getDateValues(dates: string[]) {
  return { start: dates[0], end: dates[dates.length - 1] }
}

export default async function CalendarPage() {
  const now = dayjs();
  const calendar = generateCalendar({ year: now.year(), month: now.month() }).flat();
  const { start, end } = getDateValues(calendar)

  const episodes = await fetchSonarr({
    path: '/calendar',
    schema: CalendarSchema,
    params: { start, end }
  });

  return <Calendar date={dayjs().format()} initialEpisodes={episodes} />
}