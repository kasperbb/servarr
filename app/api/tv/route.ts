import { parseHTML } from 'linkedom';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const html = await fetchImdbHtml();
  const json = parseImdbHtml(html);
  return NextResponse.json(json, { status: 200 });
}

async function fetchImdbHtml() {
  const res = await fetch('https://www.imdb.com/chart/tvmeter');

  if (!res.ok) {
    throw new Error('Failed to fetch series');
  }

  return await res.text();
}

function parseImdbHtml(html: string) {
  const { document } = parseHTML(html);

  const series = Array.from(document.querySelectorAll('.ipc-metadata-list-summary-item'));

  return series.map((series) => {
    const title = series.querySelector('.ipc-title');
    const ranking = series.querySelector('.meter-const-ranking');
    const elevation = getRatingElevation(ranking?.querySelector('span'));
    const [year, episodes, certification] = Array.from(series.querySelectorAll('.cli-title-metadata-item'));
    const image = series.querySelector('.ipc-image');

    return {
      title: title?.textContent,
      ranking: ranking?.textContent?.split(' ')[0],
      year: year?.textContent,
      episodes: episodes?.textContent,
      certification: certification?.textContent,
      image: image?.getAttribute('src'),
      elevation,
    };
  });
}

function getRatingElevation(element: Element | null | undefined) {
  const arrowUp = element?.querySelector('.ipc-icon--arrow-drop-up');
  const arrowDown = element?.querySelector('.ipc-icon--arrow-drop-down');
  const dash = element?.querySelector('.ipc-icon--dash');
  const text = element?.textContent;

  if (dash) {
    return {
      type: 'neutral',
    };
  }

  if (!text) throw new Error('Failed to parse rating elevation');

  if (arrowUp) {
    return {
      type: 'increase',
      number: parseInt(text, 10),
    };
  }

  if (arrowDown) {
    return {
      type: 'decrease',
      number: parseInt(text, 10),
    };
  }

  throw new Error('Failed to parse rating elevation');
}
