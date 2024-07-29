import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCompanyUserStats } from "../../Api/company";
import { CompanyUserStatResponse } from "../../Types/api";
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

type TProps = {
  company_id: number;
  user_id: number;
};

const CompanyUserChart: React.FC<TProps> = ({ company_id, user_id }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const processChartData = (data: CompanyUserStatResponse[]) => {
      const allRatings = data
        .flatMap((quiz) =>
          quiz.rating.map((rating) => ({ ...rating, quiz_id: quiz.quiz_id }))
        )
        .sort(
          (a, b) =>
            new Date(a.pass_at).getTime() - new Date(b.pass_at).getTime()
        );

      const ratingsByQuiz = data.map((quiz) => ({
        quiz_id: quiz.quiz_id,
        ratings: allRatings.filter((r) => r.quiz_id === quiz.quiz_id),
      }));

      const datasets = ratingsByQuiz.map((quiz) => ({
        label: `Quiz ${quiz.quiz_id}`,
        data: quiz.ratings.map((r) => ({
          x: new Date(r.pass_at),
          y: r.current_rating,
        })),
        borderColor: getRandomColor(),
        backgroundColor: getRandomColor(),
        fill: false,
      }));

      const labels = Array.from(
        new Set(allRatings.map((r) => new Date(r.pass_at)))
      );

      setChartData({
        labels,
        datasets,
      });
    };

    const fetchCompanyUserStats = async () => {
      try {
        const res = await getCompanyUserStats(company_id, user_id);
        processChartData(res);
      } catch (error: any) {
        toast.error(error);
      }
    };

    fetchCompanyUserStats();
  }, [company_id, user_id]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div style={{ width: "100vh", height: "500px" }}>
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
                text: "Quiz Ratings Over Time",
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

export default CompanyUserChart;
