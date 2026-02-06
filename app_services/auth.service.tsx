import { UserProfile } from "../types";


/* NOTE:Mock auth, no api calls
*/

const USER_KEY = "nutrix_user";

export function login(email: string): UserProfile | null {
    if (!email) return null;

    const saved = localStorage.getItem(USER_KEY);
    if (!saved) return null;

    return JSON.parse(saved) as UserProfile;
}

export async function register(
  name: string, 
  email: string, // Drugi argument to string
  profileOverrides?: Partial<UserProfile>
): Promise<UserProfile> {
  const user: UserProfile = {
    name: name || "User",
    email: email, // Teraz email jest na głównym poziomie obiektu
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

  localStorage.setItem("USER_KEY", JSON.stringify(user));
  return user;
}

export function logout() {
    localStorage.removeItem(USER_KEY);
}
