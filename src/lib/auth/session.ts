import { getServerSession } from "next-auth";
import { authOptions } from "./options";

export const getCurrentSession = () => getServerSession(authOptions);

export const getCurrentUser = async () => {
  const session = await getCurrentSession();
  return session?.user ?? null;
};
