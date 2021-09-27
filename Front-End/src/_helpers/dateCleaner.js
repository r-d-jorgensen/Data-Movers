// Turns t type Date into YYYY-MM-DD HH:MM:SS date type
export default function dateCleaner(dateStr) {
  return new Date(dateStr).toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');
}
