"use client";

import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Trophy, Medal } from "lucide-react";
import { useUser } from "@/components/UserProvider";

// Demo leaderboard: shows the signed-in student's own band plus sample peers
// so the page is meaningful before a public rankings API exists.
const PEERS = [
  { name: "Aarav S.", band: 8.0, tests: 24 },
  { name: "Priya M.", band: 7.8, tests: 31 },
  { name: "Rohan K.", band: 7.5, tests: 18 },
  { name: "Sneha P.", band: 7.2, tests: 15 },
  { name: "Vikram R.", band: 7.0, tests: 12 },
  { name: "Ananya D.", band: 6.8, tests: 20 },
  { name: "Karan J.", band: 6.5, tests: 9 },
];

export default function LeaderboardPage() {
  // Session comes from the shared context (one request per session, not one
  // per page) — no mount flag, no skeleton, no duplicate fetch.
  const { ready, authenticated, user, stats } = useUser();

  const rows = useMemo(() => {
    const me =
      authenticated && user
        ? {
            name: `${user.name ?? "You"} (you)`,
            band: stats?.averageBand ?? 0,
            tests: stats?.totalTests ?? 0,
            you: true,
          }
        : null;
    return [...(me ? [me] : []), ...PEERS].sort((a, b) => b.band - a.band);
  }, [authenticated, user, stats]);

  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <Navbar />
      <main id="main" className="page-wrap flex gap-6 py-10">
        <Sidebar active="/leaderboard" />
        <div className="min-w-0 flex-1">
          <Breadcrumbs trail={[{ label: "Leaderboard" }]} />
          <h1 className="type-h1 flex items-center gap-2">
            <Trophy size={28} strokeWidth={1.75} className="text-[#D97706]" /> Leaderboard
          </h1>
          <p className="type-lead mt-1">Top average bands this week. Take tests to climb.</p>

          {!ready ? (
            <div className="skeleton mt-6 h-96 rounded-2xl" />
          ) : (
            <div className="warm-card mt-6 overflow-x-auto">
              {/* min-width keeps columns readable; the wrapper scrolls
                  horizontally on phones instead of squashing the table. */}
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#EBE3D5] bg-[#FCF9F2] text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-bold">Rank</th>
                    <th className="px-5 py-3 font-bold">Student</th>
                    <th className="px-5 py-3 font-bold">Tests</th>
                    <th className="px-5 py-3 text-right font-bold">Avg band</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={r.name}
                      className={`border-b border-[#F3EDE0] last:border-0 ${r.you ? "bg-[#FEF3C7]/50" : ""}`}
                    >
                      <td className="px-5 py-3 font-bold text-slate-700">
                        {i < 3 ? (
                          <span className="inline-flex items-center gap-1">
                            <Medal
                              size={16}
                              strokeWidth={1.75}
                              className={i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : "text-amber-700"}
                            />
                            {i + 1}
                          </span>
                        ) : (
                          i + 1
                        )}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-800">{r.name}</td>
                      <td className="px-5 py-3 text-slate-600">{r.tests}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="badge-blue !text-sm">Band {r.band}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-500">
            Demo rankings — connect the full user base to /api/leaderboard for live competition.
          </p>
        </div>
      </main>
    </div>
  );
}
