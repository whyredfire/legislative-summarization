import { cookies } from "next/headers";

export async function isUserLoggedIn() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    return true;
  }
  return false;
}
