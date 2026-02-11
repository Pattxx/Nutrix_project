import { UserProfile } from "../types";
import { API_BASE_URL } from '../src';

const USER_KEY = "nutrix_user";

//logging in 
export async function login(email: string, password: string): Promise<UserProfile | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/record/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
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
//registering a new user
export async function register(
    name: string, 
    email: string,
    password: string,
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
        activityLevel: 1.2,
        ...profileOverrides,
    };

    const response = await fetch(`${API_BASE_URL}/record/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Server error");

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

export function logout() {
    localStorage.removeItem(USER_KEY);
}
