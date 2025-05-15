import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Dot
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: "#f5f5f5", padding: "5px", borderRadius: '5px', border: "1px solid #ddd" }}>
        <p>{`Score: ${payload[0].value.toFixed(2)}`}</p>
        <p>{`Time: ${label}`}</p>
      </div>
    );
  }
  return null;
};

const TrendChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <XAxis
            dataKey="time"
            tickFormatter={(timeStr) => {
              const date = new Date(timeStr);
              return `${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
