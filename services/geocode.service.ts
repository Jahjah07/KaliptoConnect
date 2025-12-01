export async function geocodeLocation(location: string) {
  const apiKey = "0cc7d356b0064366bef9d495c7aae8df"; // replace this
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    location
  )}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.results?.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return { latitude: lat, longitude: lng };
  }

  return null;
}
