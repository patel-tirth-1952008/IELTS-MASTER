"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function BandChart({ stats }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <div className="skeleton h-64 rounded-2xl" />;

  const data = {
    labels: ["Reading", "Writing", "Listening", "Speaking"],
    datasets: [
      {
        label: "Your band",
        data: [stats?.readingAvg ?? 0, stats?.writingAvg ?? 0, stats?.listeningAvg ?? 0, stats?.speakingAvg ?? 0],
        backgroundColor: "rgba(245, 158, 11, 0.25)",
        borderColor: "#D97706",
        pointBackgroundColor: "#D97706",
        borderWidth: 2,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { r: { min: 0, max: 9, ticks: { stepSize: 3 } } },
    plugins: { legend: { display: false } },
  };
  return (
    <div className="h-64">
      <Radar data={data} options={options} />
    </div>
  );
}
