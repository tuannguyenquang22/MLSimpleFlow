import Chart from "react-apexcharts";


const data = Array.from({ length: 14 }, (_, i) => ({
    x: "2021-01-01",
    y: (Math.random() * (1 - 0.5) + 0.5).toFixed(2)
}));


const PerformanceChart = () => {
    return (
        <Chart 
            options={{
                tooltip: {
                    enabled: true,
                },
                chart: {
                    id: "performance-chart",
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                
                stroke: {
                    width: 2,
                    curve: "smooth"
                },
                xaxis: {
                    categories: data.map(d => d.x),
                    labels: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                yaxis: {
                    min: 0,
                    max: 1,
                    stepSize: 0.25,
                    show: false,
                },
                grid: {
                    show: false
                },
                fill: {
                    type: "gradient",
                },
                dataLabels: {
                    enabled: false,
                }
            }}
            series={[
                {
                    name: "Accuracy",
                    data: data.map(d => d.y)
                }
            ]}
            type="area"
            height={120}
        />
    )
};

export default PerformanceChart;