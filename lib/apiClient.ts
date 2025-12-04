export async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // jika respons kosong
  const text = await res.text();
  if (!text) return { error: "Empty response from server" };

  return JSON.parse(text);
}
