import { UserProfile } from "../types";

export async function updateUserProfile(email: string, profile: UserProfile) {
    const res = await fetch(`http://localhost:5050/record/user/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || res.statusText);
    }
    return await res.json();
}
