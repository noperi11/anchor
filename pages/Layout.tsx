import React from "react";
import Header from "./Header";


export default function Layout({ children }: { children: React.ReactNode }) {
return (
<div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: 20 }}>
<Header />
<main style={{ maxWidth: 1000, margin: "20px auto" }}>{children}</main>
</div>
);
}
