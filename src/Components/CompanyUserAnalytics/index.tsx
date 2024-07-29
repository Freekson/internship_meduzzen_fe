import React, { useEffect, useState } from "react";
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
} from "chart.js";
import "chartjs-adapter-date-fns";
import { UserQuizDataResponse } from "../../Types/api";

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

interface RatingChartWithUsersProps {
  data: UserQuizDataResponse[];
}

const CompanyUserAnalytics: React.FC<RatingChartWithUsersProps> = ({
  data,
}) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const allRatings = data
      .flatMap((user) =>
        user.rating.map((rating) => ({ ...rating, user_id: user.user_id }))
      )
      .sort(
        (a, b) => new Date(a.pass_at).getTime() - new Date(b.pass_at).getTime()
      );

    const labels = Array.from(
      new Set(allRatings.map((r) => new Date(r.pass_at)))
    );

    const ratingsByUser = data.map((user) => ({
      user_id: user.user_id,
      ratings: allRatings.filter((r) => r.user_id === user.user_id),
    }));

    const datasets = ratingsByUser.map((user) => ({
      label: `User ${user.user_id}`,
      data: user.ratings.map((r) => ({
        x: new Date(r.pass_at),
        y: r.current_rating,
      })),
      borderColor: getRandomColor(),
      backgroundColor: getRandomColor(),
      fill: false,
    }));

    setChartData({
      labels,
      datasets,
    });
  }, [data]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      {chartData && (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "User Ratings Over Time",
              },
            },
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "minute",
                },
                title: {
                  display: true,
                  text: "Time",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Rating",
                },
                min: 0,
                max: 100,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default CompanyUserAnalytics;
