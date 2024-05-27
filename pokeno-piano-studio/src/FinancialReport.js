import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register 'category' scale globally
Chart.register(...registerables);

const FinancialReport = () => {
    const [yearToDate, setYearToDate] = useState(0);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [yearToDateResponse, monthlyDataResponse] = await Promise.all([
                    axios.get('http://localhost:5000/payments/year-to-date'),
                    axios.get('http://localhost:5000/payments/monthly')
                ]);
                setYearToDate(yearToDateResponse.data.total_amount);
                setMonthlyData(monthlyDataResponse.data);
            } catch (error) {
                console.error('Error fetching payments data:', error);
            }
        };

        fetchData();
    }, []);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create an array with data for all months
    const filledMonthlyData = monthNames.map((month, index) => {
        const found = monthlyData.find(data => data.month === index + 1);
        return found || { month: index + 1, total_amount: 0 };
    });

    const getMonthlyAmounts = () => {
        return filledMonthlyData.map(data => data.total_amount);
    };
    
    const barData = {
        labels: monthNames,
        datasets: [
            {
                label: 'Monthly Payments',
                data: getMonthlyAmounts(),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
        options: {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => `$${value.toFixed(2)}`,
                    color: 'black',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true,
                        callback: (value) => `$${value.toFixed(2)}`,
                    },
                },
            },
        },
    };

    return (
        <div className="container">
            <h2>Financial Report</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h3> Current Year-to-Date Total Payments: ${yearToDate.toFixed(2)}</h3>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h4>Monthly Payments</h4>
                    <Bar data={barData} />
                </div>
            </div>
        </div>
    );
};

export default FinancialReport;
