import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getJson } from "../lib/apiClient";


export default function Dashboard() {
const [user, setUser] = useState<any>(null);
const [engagement, setEngagement] = useState<any[]>([]);


useEffect(() => {
const u = typeof window !== "undefined" ? localStorage.getItem("app_user") : null;
if (!u) {
window.location.href = "/login";
return;
}
const parsed = JSON.parse(u!);
setUser(parsed);
(async () => {
const res = await getJson(`/api/engagement?user_id=${encodeURIComponent(parsed.id)}`);
setEngagement(res.engagement || []);
})();
}, []);


return (
<Layout>
<h2>Dashboard</h2>
<div>Welcome, {user?.name}</div>
<section>
<h3>Engagement</h3>
<table style={{ width: "100%", borderCollapse: "collapse" }}>
<thead>
<tr>
<th>Date</th>
<th>Impressions</th>
<th>Clicks</th>
<th>Conversions</th>
</tr>
