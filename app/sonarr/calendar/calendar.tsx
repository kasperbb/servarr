'use client';
import 'dayjs/locale/en-gb'

import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react'
import { dayjs } from '@/lib/dayjs';
import { generateCalendar } from '@/lib/dayjs'
import { useSonarr } from '@/api/sonarr/use-sonarr';
import { CalendarSchema, Episode } from '@/api/sonarr/schema';
import { Icon } from '@/components/ui/icon';
import { useDownloadEpisode } from '@/api/sonarr/use-download-episode';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

function groupDays(episodes: Episode[] | undefined, dates: string[]) {
  const group = dates.reduce<Group>((acc, date) => {
    return { ...acc, [date]: [] }
  }, {})

  for (const episode of episodes || []) {
    const airDate = dayjs(episode.airDateUtc).format('YYYY-MM-DD')
    if (group[airDate]) group[airDate].push(episode)
  }

  return group
}

const today = dayjs().format('YYYY-MM-DD')

function getDateValues(dates: string[]) {
  return { start: dates[0], end: dates[dates.length - 1] }
}

interface Group {
  [airDate: string]: Episode[]
}

interface CalendarProps {
  date: string;
  initialEpisodes: Episode[] | undefined;
}

export default function Calendar({ date, initialEpisodes }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState(dayjs(date))
  const calendar = useMemo(() => generateCalendar({ year: selectedDate.year(), month: selectedDate.month() }).flat(), [selectedDate])
  const { start, end } = getDateValues(calendar)

  const { data: episodes } = useSonarr('/calendar', {
    params: { start, end, includeSeries: 'true' },
    schema: CalendarSchema,
    enabled: initialEpisodes === undefined || selectedDate.isSame(dayjs(date), 'month'),
  });

  const { mutate: download, isLoading: isMutating } = useDownloadEpisode()

  const weekdays = dayjs.weekdaysShort(true);
  const groupedEpisodes = useMemo(() => groupDays(episodes, calendar), [episodes, calendar]);

  const [selectedEpisode, setSelectedEpisode] = useState<Episode | undefined>(undefined);

  function handleEventClick(episode: Episode) {
    setSelectedEpisode(episode);
  }

  function handleDownload(id: number | undefined) {
    download({ id });
  }

  function isBeforeTheFirstDayOfMonth(date: string) {
    return dayjs(date).isBefore(selectedDate.startOf('month'));
  }

  function isAfterTheLastDayOfMonth(date: string) {
    return dayjs(date).isAfter(selectedDate.endOf('month'));
  }

  console.log(selectedEpisode)

  return (
    <AlertDialog>
      <AlertDialogContent className="p-4 text-white w-[500px] rounded shadow-lg bg-card -mt-60">
        <AlertDialogHeader>
          <AlertDialogTitle>{selectedEpisode?.series?.title}</AlertDialogTitle>

          <h4 className="text-xs text-gray-400">
            {selectedEpisode?.title} - S{selectedEpisode?.seasonNumber} E{selectedEpisode?.episodeNumber}
          </h4>

          <div className="flex gap-2 py-4">
            <span className="px-2 py-1 text-xs bg-blue-500 rounded-full">
              <span>{dayjs(selectedEpisode?.airDate).fromNow()}</span>
            </span>
            {selectedEpisode?.hasFile ? (
              <span className="px-2 py-1 text-xs bg-blue-500 rounded-full">downloaded</span>
            ) : (
              <span className="px-2 py-1 text-xs bg-red-900 rounded-full">missing</span>
            )}
          </div>

          <AlertDialogDescription className="mb-4 text-sm text-gray-400">{selectedEpisode?.overview}</AlertDialogDescription>
        </AlertDialogHeader>


        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isMutating}
            onClick={() => handleDownload(selectedEpisode?.id)}
          >
            {isMutating ? (
              <span>
                {/*<Spinner size=".75rem" />*/}
                Loading...
              </span>
            ) : (
              'Download'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

      <main className="mx-auto my-10 max-w-screen-2xl">
        <div className="flex items-center justify-center w-full gap-8 mb-8">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
            onClick={() => setSelectedDate((date) => date.subtract(1, 'month'))}
          >
            <Icon name="arrow-back" />
          </button>

          <h1 className="text-2xl">{selectedDate.format('MMMM YYYY')}</h1>

          <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
            onClick={() => setSelectedDate((date) => date.add(1, 'month'))}
          >
            <Icon name='arrow-forward' />
          </button>
        </div>

        <div className="border border-dark-700">
          <div className="grid grid-cols-7 border-dark-700">
            {weekdays.map((weekday) => (
              <div key={weekday} className="p-2 text-center border-r border-dark-700 last:border-r-0">
                {weekday}
              </div>
            ))}
          </div>
          <div className="grid h-full grid-cols-7">
            {calendar.map((day) => (
              <div key={day} className="flex flex-col border-r border-dark-700">
                <div
                  className={cn(
                    'px-4 pt-2 text-sm text-right border-dark-700 border-t',
                    day === today && 'text-primary-400 bg-card bg-opacity-25',
                    (isBeforeTheFirstDayOfMonth(day) || isAfterTheLastDayOfMonth(day)) && 'text-gray-400'
                  )}
                >
                  {dayjs(day).format('DD')}
                </div>

                {Boolean(groupedEpisodes[day]) && (
                  <ul className={cn('p-4 h-full', day === today && 'bg-card bg-opacity-25')}>
                    {groupedEpisodes[day].map((episode) => (
                      <li
                        key={episode.title}
                        title={`${episode.series?.title}- S${episode.seasonNumber} E${episode.episodeNumber}`}
                      >
                        <AlertDialogTrigger
                          className={cn(
                            'focus:ring-2 focus:ring-dark-700 focus:outline-none w-full text-left px-3 py-2 mb-2 text-xs border-l-4 shadow rounded-xs bg-card',
                            getColor(episode)
                          )}
                          onClick={() => handleEventClick(episode)}
                        >
                          <span className="text-gray-400">{dayjs(episode.airDateUtc).format('HH:mm')} - {dayjs(episode.airDateUtc).add(episode.runtime, 'minutes').format('HH:mm')}</span>
                          <div className="flex gap-1">
                            <span className="truncate">{episode.series?.title}</span>
                            <span className="overflow-hidden whitespace-nowrap shrink-0">
                              - S{episode.seasonNumber} E{episode.episodeNumber}
                            </span>
                          </div>
                        </AlertDialogTrigger>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center w-full gap-8 my-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-gray-500 rounded-xs"></div>
            <p className="text-sm">Unaired</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-green-500 rounded-xs"></div>
            <p className="text-sm">Downloaded</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-violet-500 rounded-xs"></div>
            <p className="text-sm">Downloading</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-red-500 rounded-xs"></div>
            <p className="text-sm">Missing</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-blue-500 rounded-xs"></div>
            <p className="text-sm">Unaired Premiere</p>
          </div>
        </div>
      </main>
    </AlertDialog>
  )
}

function getColor(item: Episode) {
  if (item.hasFile) {
    return 'border-green-500'
  }

  /*if (item.downloading) {
    return 'border-violet-500'
  }*/

  if (!item.hasFile && dayjs(item.airDate).isBefore(today)) {
    return 'border-red-500'
  }

  if (!item.hasFile && item.episodeNumber === 1) {
    return 'border-blue-500'
  }

  return 'border-gray-500'
}