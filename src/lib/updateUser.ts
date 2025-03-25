import { User } from "@/types/user";

export async function updateUser(userId: string, values: Partial<User>) {
  try {
    if (!userId) {
      throw new Error("No id provided");
    }

    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { user: null, message: errorData.message };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { user: null, message: "Internal Server Error" };
  }
}
