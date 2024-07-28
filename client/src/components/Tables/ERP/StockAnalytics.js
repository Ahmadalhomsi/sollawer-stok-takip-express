import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockMovementAnalytics = () => {
  const [stockMovements, setStockMovements] = useState([]);

  useEffect(() => {
    const fetchStockMovementData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/erp/stockMovements');
        const data = await response.json();
        console.log('Stock movement data:', data);
        setStockMovements(data);
      } catch (error) {
        console.error('Error fetching stock movement data:', error);
      }
    };

    fetchStockMovementData();
  }, []);

  const stockMovementData = stockMovements.map(movement => ({
    ...movement,
    need: movement.requested - ((movement.boxQuantity || 1) * (movement.quantity || 0)),
  }));

  const barChartData = stockMovementData.map(movement => ({
    name: movement.stockName,
    need: movement.need,
    requested: movement.requested,
  }));

  const pieData = stockMovementData.map(movement => ({
    name: movement.stockName,
    value: movement.need,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19B3', '#FF1919', '#FFE319'];

  return (
    <div>
      <h1>Stock Movement Analytics</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <ResponsiveContainer width="50%" height={400}>
          <BarChart data={barChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="need" fill="#8884d8" />
            <Bar dataKey="requested" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="40%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <h2>Stock Movements Analysis</h2>
      <table>
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Movement Type</th>
            <th>Quantity</th>
            <th>Requested</th>
            <th>Box Quantity</th>
            <th>Need</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {stockMovementData.map(movement => (
            <tr key={movement.id}>
              <td>{movement.stockName}</td>
              <td>{movement.movementType}</td>
              <td>{movement.quantity}</td>
              <td>{movement.requested}</td>
              <td>{movement.boxQuantity}</td>
              <td>{movement.need}</td>
              <td>{movement.date ? new Date(movement.date).toLocaleDateString() : ''}</td>
              <td>{movement.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockMovementAnalytics;
