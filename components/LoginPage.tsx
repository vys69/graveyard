"use client";

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
    return (
      <div className="flex flex-col md:flex-row h-screen relative">
        <div className="w-full md:w-1/2 bg-card p-6 md:p-12 flex flex-col justify-center items-center absolute md:static inset-0">
          <div className="w-full max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold mb-5 text-center">GRAVEYARD</h1>
            <Button 
              onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign in with Discord
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-black/50 h-full">
          {/* <img src="/images/login.png" alt="Login" width={500} height={500} /> */}
        </div>
      </div>
    );
  }