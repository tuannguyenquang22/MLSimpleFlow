import Chart from 'react-apexcharts'

const PredictActualChart = ({ target, data }) => {
    return (
        <Chart
            type="scatter"
            options={{
                chart: {
                    height: 350,
                    type: 'scatter',
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                xaxis: {
                    tickAmount: 5,
                    labels: {
                        formatter: function(val) {
                            return parseFloat(val).toFixed(2)
                        }
                    }
                },
                yaxis: {
                    tickAmount: 5,
                    labels: {
                        formatter: function(val) {
                            return parseFloat(val).toFixed(2)
                        }
                    }
                },
            }} 
            series={[
                {
                    name: `${target}`,
                    data: data
                }
            ]}
            
        />
    )
};

export default PredictActualChart;