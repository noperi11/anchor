// client-side helper to call our internal API routes (UI -> API)
export async function postJson(url: string, body: any) {
const res = await fetch(url, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(body)
});
return res.json();
}


export async function getJson(url: string) {
const res = await fetch(url);
return res.json();
}
