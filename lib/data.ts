import { Wrench, Briefcase, LifeBuoy, FileText, Calendar, DollarSign, Timer, Info, Ticket, TicketPlus, TicketCheck, Image, Images, User, FilePlus, FileCheck, LucideIcon, FileCheck2 } from 'lucide-react';

export interface CardTaskData {
  title: string;
  icon: LucideIcon;
  link?: string;
  tasks: {
    title: string;
    icon: LucideIcon;
    link: string;
  }[];
}

export const cardTasks: CardTaskData[] = [
  {
    title: "Tools",
    icon: Wrench,
    tasks: [
      {
        title: "Calendar",
        icon: Calendar,
        link: "/calendar",
      },
      {
        title: "Notes",
        icon: FileText,
        link: "/notes",
      },
      {
        title: "Timer",
        icon: Timer,
        link: "/timer",
      },
      {
        title: "Bank",
        icon: DollarSign,
        link: "/bank",
      },
    ],
  },
  {
    title: "Portfolio",
    icon: Briefcase,
    tasks: [
      {
        title: "Inspiration",
        icon: Image,
        link: "/inspiration",
      },
      {
        title: "Client work",
        icon: FileText,
        link: "/client-work",
      },
      {
        title: "Portfolio",
        icon: Briefcase,
        link: "/portfolio",
      },
      {
        title: "Gallery",
        icon: Images,
        link: "/gallery",
      },
    ],
  },
  {
    title: "Support",
    icon: LifeBuoy,
    tasks: [
      {
        title: "New ticket",
        icon: TicketPlus,
        link: "/tickets/new",
      },
      {
        title: "Open tickets",
        icon: Ticket,
        link: "/tickets/open",
      },
      {
        title: "Closed tickets",
        icon: TicketCheck,
        link: "/tickets/closed",
      },
      {
        title: "Knowledge base",
        icon: Info,
        link: "/knowledge-base",
      },
    ],
  },
  {
    title: "Clients",
    icon: User,
    tasks: [
      {
        title: "New task",
        icon: FilePlus,
        link: "/tasks/new",
      },
      {
        title: "Open tasks",
        icon: FileCheck2,
        link: "/tasks/open",
      },
      {
        title: "Manage Tasks",
        icon: FileCheck,
        link: "/tasks/manage",
      },
    ],
  },
];