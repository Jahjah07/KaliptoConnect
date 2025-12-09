export function extractReceiptDataText(rawText: string) {
  const text = rawText.toLowerCase();

  // Amount
  const amountMatch =
    text.match(/₱\s*([0-9,]+\.\d{2})/) ||
    text.match(/(?:total|amount)[^\d]*([0-9,]+\.\d{2})/);

  const amount = amountMatch
    ? parseFloat(amountMatch[1].replace(/,/g, ""))
    : 0;

  // Store
  const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);
  const store = lines.length ? lines[0] : "Unknown Store";

  // Date
  const dateMatch =
    text.match(/\d{4}-\d{2}-\d{2}/) ||
    text.match(/\d{2}\/\d{2}\/\d{4}/);

  let date = new Date().toISOString().slice(0, 10);

  if (dateMatch) {
    const raw = dateMatch[0].replace(/\//g, "-");
    const parts = raw.split("-");
    if (parts[0].length === 4) date = raw;
    else date = `${parts[2]}-${parts[0]}-${parts[1]}`;
  }

  return { amount, store, date };
}
