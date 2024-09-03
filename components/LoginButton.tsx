import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useRouter } from 'next/navigation';

export function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <Button onClick={() => signOut()}>
        Sign out
      </Button>
    );
  }
  return (
    <Button onClick={() => router.push('/login')}>
      Sign in <LogIn className="w-4 h-4 ml-2" />
    </Button>
  );
}