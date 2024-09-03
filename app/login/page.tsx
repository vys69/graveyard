"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn('discord', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Welcome to The Graveyard</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Button type="submit" className="w-full">
            Sign in with Discord <LogIn className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}