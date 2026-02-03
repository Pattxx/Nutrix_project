import { UserProfile } from "../types";


/*
  NOTE:Mock auth, no api calls
*/

const USER_KEY = "nutrix_user";

export function login(email: string): UserProfile | null {
    if (!email) return null;

    const saved = localStorage.getItem(USER_KEY);
    if (!saved) return null;

    return JSON.parse(saved) as UserProfile;
}

export function register(
    name: string,
    profileOverrides?: Partial<UserProfile>
): UserProfile {
    const user: UserProfile = {
        name: name || "User",
        age: 25,
        weight: 70,
        height: 175,
        gender: "male",
        goal: "maintain",
        activityLevel: 1.2,
        ...profileOverrides,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

export function logout() {
    localStorage.removeItem(USER_KEY);
}
