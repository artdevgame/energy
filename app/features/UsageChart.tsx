import {
    CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useAnnotationsConfig } from '~/hooks/useConfig';
import { toKWh, useGraphData } from '~/hooks/useGraphData';
import { Switch } from '~/ui/Switch';

import { useOctopusData } from './config/ConfigOctopus/octopusContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

export const UsageChart = () => {
  const { annotations: annotationsConfig } = useAnnotationsConfig();
  const [showAnnotations, setAnnotationsVisible] = useState(false);
  const [showCubicMetres, setCubicMetres] = useState(false);
  const {
    state: { electric, gas },
  } = useOctopusData();
  const { dd, labels, totals } = useGraphData();

  const billedAmounts = Object.values(totals).map((total) => total.combined);

  let annotationY = 0;

  const annotations = Object.entries(annotationsConfig).reduce(
    (prev, [date, annotationsForDate]) => {
      const current = annotationsForDate?.reduce(
        (prevA, annotation, annotationIndex) => {
          const config = {
            borderWidth: 1,
            label: {
              content: (ctx: any) => annotation,
              display: true,
              position: `${annotationY}%`,
            },
            scaleID: "x",
            type: "line",
            value: date,
          };

          annotationY += 15;
          if (annotationY >= 100) annotationY = 0;

          return {
            ...prevA,
            [`${date}-${annotationIndex}`]: config,
          };
        },
        {}
      );

      return {
        ...prev,
        ...current,
      };
    },
    {}
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Electric",
        data: electric?.map((reading) => reading.consumption),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.4,
        tooltip: {
          callbacks: {
            label: (config: any) =>
              `${config.dataset.label}: ${config.formattedValue} kWh`,
            afterLabel: (config: any) =>
              `Total: ~£${totals[config.label].electric}`,
          },
        },
      },
      {
        label: "Gas",
        data: gas?.map((reading) =>
          showCubicMetres ? reading.consumption : toKWh(reading.consumption)
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
        tooltip: {
          callbacks: {
            label: (config: any) =>
              `${config.dataset.label}: ${config.formattedValue} ${
                showCubicMetres ? "m3" : "kWh"
              }`,
            afterLabel: (config: any) => `Total: ~£${totals[config.label].gas}`,
          },
        },
      },
      {
        label: "Combined Cost",
        data: billedAmounts,
        tension: 0.4,
        borderColor: "rgb(163, 230, 53)",
        backgroundColor: "rgba(163, 230, 53, 0.5)",
        tooltip: {
          callbacks: {
            label: (config: any) =>
              `${config.dataset.label}: ~£${config.raw.toFixed(2)}`,
          },
        },
      },
      {
        label: "Direct Debit",
        data: dd,
        borderColor: "rgb(255,215,0)",
        backgroundColor: "rgba(255,215,0, 0.5)",
        tooltip: {
          callbacks: {
            label: (config: any) => `${config.dataset.label}: £${config.raw}`,
          },
        },
      },
    ],
  };

  const options = useMemo(
    () => ({
      plugins: {
        ...(showAnnotations && { annotation: { annotations } }),
      },
      scales: {
        x: {
          grid: {
            borderDash: [2],
            color: "rgb(0, 0, 0, 0.08)",
          },
        },
        y: {
          display: false,
        },
      },
    }),
    [showAnnotations, annotations]
  );

  if (!electric.length && !gas.length) {
    return <UsageChartSkeleton />;
  }

  return (
    <div>
      <section className="mb-4 flex justify-between">
        <Switch enabled={showAnnotations} onChange={setAnnotationsVisible}>
          Show Annotations
        </Switch>
        <Switch enabled={showCubicMetres} onChange={setCubicMetres}>
          <>
            Display gas in m<sup>3</sup>
          </>
        </Switch>
      </section>
      <Line data={data} options={options} />
    </div>
  );
};

export const UsageChartSkeleton = () => (
  <div className="w-full aspect-video bg-gray-100 flex flex-col items-center justify-center">
    <p className="text-xl text-gray-700">Waiting for data</p>
    <p className="text-sm text-gray-500">(configure settings below)</p>
  </div>
);
