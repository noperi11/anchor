import React from "react";


export default function Header() {
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Supabase CRUD";
return (
<header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<h1 style={{ margin: 0 }}>{appName}</h1>
<div>Prototype</div>
</header>
);
}
