import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface AuthWrapperProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function AuthWrapper({ children, adminOnly = false }: AuthWrapperProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to access this content.</div>;
  }

  if (adminOnly && !session.user.isAdmin) {
    return <div>You do not have permission to access this content.</div>;
  }

  return <>{children}</>;
}