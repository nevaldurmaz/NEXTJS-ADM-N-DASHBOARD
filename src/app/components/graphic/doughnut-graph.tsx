"use client";
import { FC } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

interface Props {
  labels: string[];
  values: number[];
}

const DoughnutGraph: FC<Props> = ({ labels, values }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Kategorideki Ürün Sayısı",
        data: values,
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // TÜRKÇE OPTIONS
  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#374151",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value} ürün`;
          },
          title: function (context: any) {
            return "Kategori Detayı";
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full my-3">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutGraph;
