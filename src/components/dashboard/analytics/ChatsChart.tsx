"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Card from "@/components/ui/Card";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { Icons } from "@/components/ui";
import type { ChatsTimePoint } from "@/interfaces/Analytics.interface";

interface ChatsChartProps {
  data: ChatsTimePoint[];
  loading?: boolean;
  className?: string;
}

const ChatsChart: React.FC<ChatsChartProps> = ({
  data,
  loading = false,
  className = "",
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <div className="p-6">
          <div className="mb-4">
            <div className="h-6 bg-neutral-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
          <SkeletonLoader className="h-80" />
        </div>
      </Card>
    );
  }

  // Format data for chart
  const chartData = data.map((point) => {
    // Parse date as local date to avoid timezone issues
    const dateParts = point.date.split("-");
    const localDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2]),
    );

    return {
      date: localDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      "New Chats": point.newChats || 0,
    };
  });

  return (
    <Card
      className={`bg-white border-border-light hover:border-border-medium transition-colors duration-200 ${className}`}
    >
      <div className="p-6">
        {/* Simple header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-xl shadow-inner">
              <Icons.MessageSquare className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Chat Activity
              </h3>
              <p className="text-sm text-text-secondary">
                New conversations started in the last 7 days
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {chartData
                .reduce((sum, point) => sum + point["New Chats"], 0)
                .toLocaleString()}
            </div>
            <div className="text-xs text-text-secondary">New Chats</div>
          </div>
        </div>

        {/* Simple chart container */}
        <div className="bg-bg-secondary rounded-lg p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="chatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9333ea" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.1)",
                    fontSize: "14px",
                    padding: "12px",
                  }}
                  labelStyle={{
                    color: "#0f172a",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                  formatter={(value, name) => [
                    <span style={{ color: "#9333ea", fontWeight: "600" }}>
                      {value.toLocaleString()}
                    </span>,
                    name,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="New Chats"
                  stroke="#9333ea"
                  strokeWidth={3}
                  fill="url(#chatGradient)"
                  dot={{ r: 4, fill: "#9333ea", strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    fill: "#7e22ce",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatsChart;
