async function getSeries() {
  const res = await fetch('http://localhost:3000/api/tv', {
    next: {
      revalidate: 1,
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export default async function Home() {
  const series = await getSeries();
  return (
    <main className="flex flex-wrap gap-4 p-2">
      {series.map((show) => (
        <div className="flex bg-dark-700">
          <img className="w-28" src={show.image} />
          <div className="flex flex-col p-2">
            <p className="text-white">{show.ranking} ({show.elevation.number})</p>
            <h2 className="text-2xl font-bold text-white">{show.title}</h2>
            <p className="text-white">{show.episodes}</p>
            <p className="text-white">{show.certification}</p>
            <p className="text-white">{show.year}</p>
          </div>
        </div>
      ))}
    </main>
  )
}
