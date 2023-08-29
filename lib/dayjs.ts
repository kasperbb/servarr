import 'dayjs/locale/en-gb';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';
import CalendarSets from 'dayjs-plugin-calendar-sets';

dayjs.locale('en-gb');
dayjs.extend(localeData);
dayjs.extend(relativeTime);
dayjs.extend(CalendarSets);

interface GenerateCalendarProps {
  month?: number;
  year?: number;
}

export function generateCalendar({ year, month }: GenerateCalendarProps) {
  const set = dayjs.calendarSets().month({ year, month, chunked: true });

  return set.map((chunk) => {
    const hasEmptySlot = chunk.some((date) => date === '');
    if (!hasEmptySlot) return chunk;

    if (chunk[0] === '') {
      return fillChunkLeft(chunk);
    }

    if (chunk[6] === '') {
      return fillChunkRight(chunk);
    }

    return chunk;
  });
}

function fillChunkLeft(chunk: string[]) {
  const reversed = chunk.reverse();
  const firstDate = dayjs(reversed[0]);

  return Array.from({ length: 7 })
    .map((_, i) => {
      return firstDate.subtract(i, 'day').format('YYYY-MM-DD');
    })
    .reverse();
}

function fillChunkRight(chunk: string[]) {
  const firstDate = dayjs(chunk[0]);

  return Array.from({ length: 7 }).map((_, i) => {
    return firstDate.add(i, 'day').format('YYYY-MM-DD');
  });
}

export { dayjs };
