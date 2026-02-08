export async function saveMealLog(entry: any) {
    const res = await fetch("http://localhost:5050/record/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || res.statusText);
    }
    return await res.json();
}

export async function fetchMealLogs(email?: string) {
    const url = new URL("http://localhost:5050/record/history");
    if (email) url.searchParams.set("email", email);
    const res = await fetch(url.toString());
    if (!res.ok) {
        const text = await res.text();
        console.error("Fetch failed with status", res.status, "body:", text);
        throw new Error(`Failed to fetch history: ${res.status}`);
    }
    return await res.json();
}

export async function fetchWeeklyStats(email: string) {
    const url = new URL("http://localhost:5050/record/history/weekly");
    url.searchParams.set("email", email);
    const res = await fetch(url.toString());
    if (!res.ok) {
        const text = await res.text();
        console.error("Fetch weekly failed with status", res.status, "body:", text);
        throw new Error(`Failed to fetch weekly stats: ${res.status}`);
    }
    return await res.json();
}
