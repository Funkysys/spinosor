import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useProtectedRoute = (requiredRole: "ADMIN") => {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (!session?.user?.email) return;
        const response = await fetch(`/api/user?email=${session.user.email}`);
        setUser(await response.json());

        if (user?.role) {
          setRole(user.role);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du rôle de l'utilisateur:",
          error
        );
      }
    };

    if (status === "authenticated" && session?.user?.email) {
      fetchUserRole();
    }
  }, [session, status, router, user?.role]);

  useEffect(() => {
    if (role && role !== requiredRole) {
      router.push("/");
    }
  }, [role, requiredRole, router]);

  if (status === "loading" || !role) {
    return { loading: true };
  }

  return { loading: false, role, session, user };
};

export default useProtectedRoute;
