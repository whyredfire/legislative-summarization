import { api } from "@/api/api";

export async function verifyToken(token: string) {
  try {
    const response = await api.post("/auth/verify", { token });
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
