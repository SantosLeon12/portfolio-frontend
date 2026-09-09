import {
  BriefcaseBusiness,
  Building2,
  Code2,
  FileImage,
  FolderKanban,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Mail,
  UserRound,
} from "lucide-react";


export const adminNavigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: UserRound,
  },
  {
    label: "Experience",
    href: "/admin/experience",
    icon: BriefcaseBusiness,
  },
  {
    label: "Education",
    href: "/admin/education",
    icon: GraduationCap,
  },
  {
    label: "Technologies",
    href: "/admin/technologies",
    icon: Code2,
  },
  {
    label: "Languages",
    href: "/admin/languages",
    icon: Languages,
  },
  {
    label: "Organizations",
    href: "/admin/organizations",
    icon: Building2,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: FileImage,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
] as const;