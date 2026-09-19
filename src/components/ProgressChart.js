"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ProgressChart({ recent = [] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <div className="skeleton h-56 rounded-2xl" />;

  const ordered = [...recent].reverse();
  const data = {
    labels: ordered.map((_, i) => `Test ${i + 1}`),
    datasets: [
      {
        label: "Band score",
        data: ordered.map((r) => r.bandScore ?? 0),
        borderColor: "#0284C7",
        backgroundColor: "#0284C7",
        tension: 0.3,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { min: 0, max: 9 } },
    plugins: { legend: { display: false } },
  };
  if (!ordered.length) {
    return <p className="py-10 text-center text-sm text-slate-500">No tests yet — your progress line will appear here.</p>;
  }
  return (
    <div className="h-56">
      <Line data={data} options={options} />
    </div>
  );
}
