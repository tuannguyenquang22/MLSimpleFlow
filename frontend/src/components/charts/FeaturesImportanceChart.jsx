import Chart from 'react-apexcharts';


const FeaturesImportanceChart = ({ features, data }) => {
    return (
        <Chart 
            series={[
                { data: data.map((item) => parseFloat(item).toFixed(4))}
            ]}
            options={{
                chart: {
                    type: "bar",
                    height: 500
                },
                plotOptions: {
                    bar: {
                        barHeight: 15,
                        borderRadius: 4,                 
                        borderRadiusApplication: 'end',
                        horizontal: true,
                    }
                },
                tooltip: {
                    enabled: false,
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: features
                }
            }}
            type="bar"
        />
    )
};

export default FeaturesImportanceChart;