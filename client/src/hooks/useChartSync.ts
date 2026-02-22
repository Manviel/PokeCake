import { $, type Signal, useSignal, useTask$ } from "@builder.io/qwik";
import Chart from "chart.js/auto";

export interface ChartSyncProps {
  data: number[];
  labels: string[];
  label: string;
  color?: string;
}

export function useChartSync(
  canvasRef: Signal<HTMLCanvasElement | undefined>,
  props: ChartSyncProps,
) {
  const chartInstance = useSignal<Chart | null>(null);

  // Handle updates
  useTask$(({ track }) => {
    track(() => props.data);
    track(() => props.labels);

    if (typeof window !== "undefined" && chartInstance.value) {
      chartInstance.value.data.labels = props.labels;
      chartInstance.value.data.datasets[0].data = props.data;
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
      const color = props.color ?? "rgb(75, 192, 192)";
      chartInstance.value = new Chart(canvasRef.value, {
        type: "line",
        data: {
          labels: props.labels,
          datasets: [
            {
              label: props.label,
              data: props.data,
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

  return { initChart };
}
