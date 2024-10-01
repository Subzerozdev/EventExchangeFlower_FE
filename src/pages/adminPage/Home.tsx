import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

function Home() {
  const data = [
    {
      name: "01",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "02",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "03",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "04",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "05",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "06",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "07",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>
      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>PRODUCTS</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>300</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>CATEGORY</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>12</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>33</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>SELLER</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>33</h1>
        </div>
      </div>
      <div className="nameCharts">
        <h2>Doanh thu</h2>
        <h2>Đơn hàng</h2>
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" name="Last 6 days" fill="#8884d8" />
            <Bar dataKey="uv" name="Last Week" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              name="Last 6 Days"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="uv"
              name="Last Week"
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
