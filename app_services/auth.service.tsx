import { UserProfile } from "../types";


/*
NOTE:Mock auth, no api calls
*/

const USER_KEY = "nutrix_user";

// auth.service.tsx

export async function login(email: string): Promise<UserProfile | null> {
    try {
        const response = await fetch("http://localhost:5050/record/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();

        if (!response.ok) {
            console.warn("Login failed:", data?.message || response.statusText);
            return null;
        }

        localStorage.setItem(USER_KEY, JSON.stringify(data));
        return data;
    } catch (err) {
        console.error("Login error:", err);
        return null;
    }
}
export async function register(
    name: string, 
    email: string, 
    profileOverrides?: Partial<UserProfile>
): Promise<UserProfile> {
    const user: UserProfile = {
        name: name || "User",
        email: email, 
        age: 25,
        weight: 70,
        height: 175,
        gender: "male",
        goal: "maintain",
        activityLevel: "light",
        ...profileOverrides,
    };

    const response = await fetch("http://localhost:5050/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Błąd serwera");

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

export function logout() {
    localStorage.removeItem(USER_KEY);
}
