import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import './ApexChart.css'

const ApexChart = () => {
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({
        chart: {
            id: 'area-datetime',
            type: 'area',
            zoom: {
                autoScaleXaxis: true
            }
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
            style: 'hollow',
        },
        xaxis: {
            type: 'datetime',
            tickAmount: 6,
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy'
            },
            style: {
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
            }

        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100]
            }
        },
    });

    const [selection, setSelection] = useState('one_month');

    useEffect(() => {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(item => [new Date(item.timestamp).getTime(), item.value]);
                setSeries([{ data: formattedData }]);

                const minTime = new Date(Math.min(...formattedData.map(d => d[0]))).getTime();
                const maxTime = new Date(Math.max(...formattedData.map(d => d[0]))).getTime();

                setOptions(prevOptions => ({
                    ...prevOptions,
                    xaxis: {
                        ...prevOptions.xaxis,
                        min: minTime,
                        max: maxTime
                    }
                }));
            });
    }, []);

    const updateData = (timeline) => {
        setSelection(timeline);
        switch (timeline) {
            case 'one_month':
                ApexCharts.exec('area-datetime', 'zoomX', new Date('2023-01-01').getTime(), new Date('2023-01-31').getTime());
                break;
            case 'six_months':
                ApexCharts.exec('area-datetime', 'zoomX', new Date('2023-01-01').getTime(), new Date('2023-06-30').getTime());
                break;
            case 'one_year':
                ApexCharts.exec('area-datetime', 'zoomX', new Date('2023-01-01').getTime(), new Date('2023-12-31').getTime());
                break;
            case 'all':
                ApexCharts.exec('area-datetime', 'zoomX', new Date('2023-01-01').getTime(), new Date('2024-01-01').getTime());
                break;
            default:
                return;
        }

    };

    return (
        <div>
            <div id="chart">
                <div className="toolbar">
                    <button id="one_month" onClick={() => updateData('one_month')} className={selection === 'one_month' ? 'active' : ''}>1M</button>
                    <button id="six_months" onClick={() => updateData('six_months')} className={selection === 'six_months' ? 'active' : ''}>6M</button>
                    <button id="one_year" onClick={() => updateData('one_year')} className={selection === 'one_year' ? 'active' : ''}>1Y</button>
                    <button id="all" onClick={() => updateData('all')} className={selection === 'all' ? 'active' : ''}>ALL</button>
                </div>
                <div id="chart-timeline">
                    <ReactApexChart options={options} series={series} type="area" height={350} />
                </div>
            </div>
        </div>
    );
}

export default ApexChart;
