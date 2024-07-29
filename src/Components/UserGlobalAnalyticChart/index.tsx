import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { UserGlobalAnalyticResponse } from "../../Types/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface RatingChartProps {
  data: UserGlobalAnalyticResponse[];
}

const UserGlobalAnalyticChart: React.FC<RatingChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => new Date(item.pass_at)),
    datasets: [
      {
        label: "Rating for quiz",
        data: data.map((item) => item.current_rating),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        fill: false,
      },
      {
        label: "Average Rating",
        data: data.map((item) => item.average_rating),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Rating",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Average Scores Over Time",
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default UserGlobalAnalyticChart;
