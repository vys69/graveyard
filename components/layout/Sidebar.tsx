"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Home, Briefcase, LifeBuoy, Menu, ChevronLeft, ChevronRight, Bone, Ticket, LogOut, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut } from 'next-auth/react';

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setIsClient(true);
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      setIsExpanded(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('sidebarExpanded', JSON.stringify(newState));
  };

  const sidebarItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/tasks", icon: Briefcase, label: "Tasks" },
    { href: "/support", icon: LifeBuoy, label: "Support" },
    { href: "/tickets", icon: Ticket, label: "Tickets" }
  ];

  const NavContent = ({ inDrawer = false }) => (
    <ul className={`space-y-4 ${inDrawer ? 'py-4' : ''}`}>
      {sidebarItems.map((item, index) => (
        <li key={index}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${!isExpanded && !inDrawer && 'px-2 md:px-2'}`} 
            asChild
          >
            <Link href={item.href} className="flex items-center">
              <item.icon className={`h-5 w-5 ${inDrawer || isExpanded ? 'mr-4' : 'md:mx-auto'}`} />
                <span className={`${!isExpanded && !inDrawer && 'md:hidden'}`}>{item.label}</span>
              </Link>
          </Button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-sidebar text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bone className="h-5 w-5" />
          <span className="text-lg font-semibold">GRAVEYARD</span>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4">
              <NavContent inDrawer={true} />
              <DrawerClose asChild>
                <Button className="mt-6 w-full" variant="outline">Close</Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Sidebar */}
      {isClient && (
        <div className="hidden md:block relative">
          <aside className={`flex flex-col bg-sidebar text-white p-4 transition-all duration-300 h-screen ${isExpanded ? 'w-64' : 'w-20'}`}>
            <div className="flex items-center space-x-2">
                {isExpanded ? (
                <div className="flex items-center space-x-2 justify-center mb-5">
                <Bone className="h-10 w-10 p-1" />
                <span className="text-2xl font-semibold">GRAVEYARD</span>
                </div>
                ) : (
                <Bone className="text-white h-10 w-10 mb-5 p-1" />
                )}
            </div>
            <nav className="flex-grow">
              <NavContent />
            </nav>
            <div className={`flex items-center mt-6 ${isExpanded ? 'justify-between' : 'justify-center'} w-full`}>
              {isExpanded ? (
                <>
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                      <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-sm font-medium">{session?.user?.name}</span>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600"
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Log out</span>
                      </Button>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                      <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Log out</span>
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </aside>
          <Button
            variant="ghost"
            className="absolute top-4 -right-2 px-0 py-0 h-6 w-6 bg-sidebar text-white rounded-r-md flex items-center justify-center"
            onClick={toggleSidebar}
          >
            {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
      )}
    </>
  );
}

export default Sidebar;