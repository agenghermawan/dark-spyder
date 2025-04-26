import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Stealer Logs', value: 1_900_000 },
  { name: 'Leaks Records', value: 69_000_000_000 },
];

const ChartSection = () => (
  <div className="w-full p-6 bg-[#141414] border-b border-gray-700">
    <h3 className="text-xl font-bold mb-4">Data Overview</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="name" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Bar dataKey="value" fill="#7d3cff" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartSection;
