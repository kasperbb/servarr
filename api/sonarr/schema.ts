import { type } from 'arktype';

export const ImageSchema = type({
  coverType: "'banner' | 'fanart' | 'poster' | 'unknown'",
  remoteUrl: 'string',
  'url?': 'string',
});

const CalendarSeasonSchema = type({
  seasonNumber: 'number',
  monitored: 'boolean',
});

export const CalendarSeriesSchema = type({
  title: 'string',
  sortTitle: 'string',
  status: 'string',
  ended: 'boolean',
  overview: 'string',
  network: 'string',
  airTime: 'string',
  images: [ImageSchema, '[]'],
  originalLanguage: {
    id: 'number',
    name: 'string',
  },
  seasons: [CalendarSeasonSchema, '[]'],
  year: 'number',
  path: 'string',
  qualityProfileId: 'number',
  seasonFolder: 'boolean',
  monitored: 'boolean',
  useSceneNumbering: 'boolean',
  runtime: 'number',
  tvdbId: 'number',
  tvRageId: 'number',
  tvMazeId: 'number',
  firstAired: 'string',
  seriesType: 'string',
  cleanTitle: 'string',
  imdbId: 'string',
  titleSlug: 'string',
  genres: 'string[]',
  tags: 'string[]',
  added: 'string',
  ratings: {
    votes: 'number',
    value: 'number',
  },
  languageProfileId: 'number',
  id: 'number',
});

export const EpisodeSchema = type({
  seriesId: 'number',
  tvdbId: 'number',
  episodeFileId: 'number',
  seasonNumber: 'number',
  episodeNumber: 'number',
  title: 'string',
  airDate: 'string',
  airDateUtc: 'string',
  runtime: 'number',
  'overview?': 'string',
  hasFile: 'boolean',
  monitored: 'boolean',
  unverifiedSceneNumbering: 'boolean',
  grabbed: 'boolean',
  id: 'number',
  'series?': CalendarSeriesSchema,
  'images?': [ImageSchema, '[]'],
});
export type Episode = (typeof EpisodeSchema)['infer'];

export const CalendarSchema = type([EpisodeSchema, '[]']);
export type Calendar = (typeof CalendarSchema)['infer'];
