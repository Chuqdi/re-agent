"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import LoginPage from "@/components/LoginPage";



import {
  Home,
  FolderKanban,
  CalendarDays,
  MapPin,
  Users,
  LogOut,
  Menu,
  GitPullRequest,
  X,
  Settings,
  CopySlash,
} from "lucide-react";
import { signOut } from "@/lib/firebase/auth";

type AppShellProps = {
  children: (user: FirebaseUser) => React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  /*{ href: "/dashboard/vault", label: "Vault", icon: FolderKanban },*/
  { href: "/dashboard/showings", label: "Showings", icon: CalendarDays },
  { href: "/dashboard/location", label: "Location", icon: MapPin },
  { href: "/dashboard/requests", label: "Requests", icon: GitPullRequest },
  { href: "/dashboard/contacts", label: "Contacts", icon: Users },
  { href: "/dashboard/invoices", label: "Invoices", icon: CopySlash },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();






  //useEffect(() => {
  //  const unsubscribe = onAuthStateChanged(auth, (u) => {
  //    setUser(u);
  //    setLoading(false);
  //  });
  //  return () => unsubscribe();
  //}, []);





  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
  
      const isMyLocationRoute = pathname.startsWith("/dashboard/mylocation");
      const hasDataQuery = typeof window !== "undefined" && window.location.search.includes("data=");
  
      // 🚨 If no user → force login (except allowed route)
      if (!u && pathname !== "/login" && !(isMyLocationRoute && hasDataQuery)) {
        router.push("/login");
      }
  
  
      // 🚨 If user is logged in and tries to go to login page
      if (u && pathname === "/login") {
        router.push("/dashboard");
      }
    });
  
    return () => unsubscribe();
  }, [pathname, router]);




  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="h-2 w-2 animate-ping rounded-full bg-white" />
          <span>Preparing your workspace…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-white text-black">
      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 md:hidden">
        <span className="text-sm font-semibold tracking-tight">AgentOS</span>
        <button
          aria-label="Toggle navigation"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((v) => !v)}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden bg-black/20"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-gray-200 bg-gray-50/80 backdrop-blur
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:flex
        `}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-semibold tracking-tight text-black">
            RE
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-black">
              AgentOS
            </span>
            <span className="text-[11px] text-gray-500">
              Real Estate Control Center
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-pill ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 px-4 py-4 text-xs text-gray-600">
          <div className=" absolute bottom-0 pb-6">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[11px] font-medium uppercase text-black">
                  {user.displayName
                    ? user.displayName
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")
                    : (user.email?.[0]?.toUpperCase() ?? "?")}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-black">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {user.email}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="inline-flex h-7 items-center gap-1 rounded-full border border-gray-300 px-2 text-[11px] text-black hover:bg-black hover:text-white"
              >
                <LogOut className="h-3 w-3" />
                <span>Sign out</span>
              </button>
            </div>
            <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500">
              <span>Workspace</span>
              <span className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-gray-700">
                Pro
              </span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden bg-white md:ml-0">
        <div className="min-w-0 flex-1 px-6 pb-8 pt-20 md:pt-6 lg:px-10 lg:pt-8">
          {children(user)}
        </div>
      </main>
    </div>
  );
}

export default AppShell;
