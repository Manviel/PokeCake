import { component$, useSignal } from "@builder.io/qwik";
import { useChartSync } from "../../hooks/useChartSync";

interface Props {
  data: number[];
  labels: string[];
  label: string;
  color?: string;
}

export const TelemetryChart = component$<Props>((props) => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  const { initChart } = useChartSync(canvasRef, props);

  return (
    <div
      class="h-64 w-full rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-md"
      onQVisible$={initChart}
    >
      <canvas ref={canvasRef} />
    </div>
  );
});
