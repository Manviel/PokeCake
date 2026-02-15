import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import Chart from "chart.js/auto";

interface Props {
  data: number[];
  labels: string[];
  label: string;
  color?: string;
}

export const TelemetryChart = component$<Props>(
  ({ data, labels, label, color = "rgb(75, 192, 192)" }) => {
    const canvasRef = useSignal<HTMLCanvasElement>();
    const chartInstance = useSignal<Chart | null>(null);

    // Handle updates
    useTask$(({ track }) => {
      track(() => data);
      track(() => labels);

      if (typeof window !== "undefined" && chartInstance.value) {
        chartInstance.value.data.labels = labels;
        chartInstance.value.data.datasets[0].data = data;
        chartInstance.value.update();
      }
    });

    // Handle cleanup
    useTask$(({ cleanup }) => {
      cleanup(() => {
        if (typeof window !== "undefined" && chartInstance.value) {
          chartInstance.value.destroy();
          chartInstance.value = null;
        }
      });
    });

    const initChart = $(() => {
      if (canvasRef.value) {
        chartInstance.value = new Chart(canvasRef.value, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: label,
                data: data,
                borderColor: color,
                tension: 0.1,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: {
                labels: {
                  color: "rgb(203, 213, 225)", // slate-300
                  font: {
                    family: "'Inter', sans-serif",
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "rgb(148, 163, 184)" }, // slate-400
                grid: { color: "rgba(255, 255, 255, 0.05)" },
              },
              y: {
                ticks: { color: "rgb(148, 163, 184)" }, // slate-400
                grid: { color: "rgba(255, 255, 255, 0.05)" },
              },
            },
          },
        });
      }
    });

    return (
      <div
        class="h-64 w-full rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-md"
        onQVisible$={initChart}
      >
        <canvas ref={canvasRef} />
      </div>
    );
  },
);
