"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, Menu, X, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import { useUser } from "@/components/UserProvider";

const PRIMARY = [
  { href: "/reading", label: "Reading" },
  { href: "/writing", label: "Writing" },
  { href: "/listening", label: "Listening" },
  { href: "/speaking", label: "Speaking" },
  { href: "/vocab", label: "Vocab" },
  { href: "/mock-test", label: "Mock Test" },
];

const SECONDARY = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/grammar", label: "Grammar" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Active when the route matches exactly or is a child of it
// (/practice/reading highlights "Reading").
function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const { ready, authenticated, user, signOut } = useUser();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

  // Close the mobile menu on navigation and on Escape (with focus returned).
  useEffect(() => setOpen(false), [pathname]);

  const onKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setOpen(false);
      menuRef.current?.querySelector("summary, a, button")?.focus?.();
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onKeyDown]);

  // Optimistic sign-out: the UI updates instantly, the cookie is cleared
  // in the background — no spinner, no waiting on the network.
  function handleLogout() {
    setSigningOut(true);
    signOut().finally(() => {
      router.push("/login");
    });
  }

  const linkClass = (href) =>
    `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive(pathname, href)
        ? "bg-[#FEF3C7] text-[#B45309]"
        : "text-slate-600 hover:bg-white hover:text-slate-900"
    }`;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[#EBE3D5] bg-[#FCF9F2]/90 backdrop-blur">
      <div className="page-wrap flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="IELTS Master home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F59E0B]">
            <GraduationCap size={20} strokeWidth={1.75} className="text-slate-950" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            IELTS <span className="text-[#D97706]">Master</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {PRIMARY.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {!ready ? (
            // Neutral placeholder that matches the final button size: no
            // layout shift, no skeleton "flash" between pages.
            <div className="h-9 w-[152px]" aria-hidden="true" />
          ) : authenticated ? (
            <>
              <Link href="/dashboard" className="btn-secondary !px-4 !py-2 text-sm">
                <LayoutDashboard size={16} strokeWidth={1.75} />
                {user?.name?.split(" ")[0] || "Dashboard"}
              </Link>
              <button
                onClick={handleLogout}
                disabled={signingOut}
                className="btn-primary !px-4 !py-2 text-sm"
              >
                {signingOut ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} strokeWidth={1.75} />
                )}
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary !px-4 !py-2 text-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary !px-4 !py-2 text-sm">
                Start Free
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-xl border border-[#EBE3D5] bg-white p-2 text-slate-800 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Mobile: horizontally scrollable module row (always visible, no tap
          needed to reach the main skills) — the menu holds the extras. */}
      <nav
        className="scroll-x no-scrollbar page-wrap gap-1.5 border-t border-[#EBE3D5] pb-2 pt-2 lg:hidden"
        aria-label="Modules"
      >
        {PRIMARY.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
              isActive(pathname, l.href)
                ? "border-[#D97706] bg-[#FEF3C7] text-[#B45309]"
                : "border-[#EBE3D5] bg-white text-slate-600"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {open && (
        <div
          id="mobile-nav"
          ref={menuRef}
          className="border-t border-[#EBE3D5] bg-[#FCF9F2] px-4 pb-4 pt-3 lg:hidden"
        >
          <div className="grid gap-1">
            {SECONDARY.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {!ready ? (
                <div className="h-10 flex-1" aria-hidden="true" />
              ) : authenticated ? (
                <>
                  <Link href="/dashboard" className="btn-secondary flex-1 text-sm">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="btn-primary flex-1 text-sm"
                  >
                    {signingOut ? "Signing out…" : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary flex-1 text-sm">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary flex-1 text-sm">
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
