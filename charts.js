let ctx = document.getElementById('myChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'Users',
            data: [65, 59, 80, 81, 56, 55, 40, 60, 70, 90, 65, 55],
            backgroundColor: '#be2490',
            hoverBorderWidth: 2,
            hoverBorderColor: '#000',
            fontWeight: 'bold'
        },
        {
            label: 'Drivers',
            data: [40, 55, 70, 60, 70, 80, 55, 65, 75, 85, 60, 45],
            backgroundColor: '#440a67',
            hoverBorderWidth: 2,
            hoverBorderColor: '#000',
            fontWeight: 'bold'
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Monthly Users & Drivers Rides Data',
            fontSize: 25,
            fontColor: '#1c1c1c',
            fontWeight: 'bold'
        },
        legend: {
            display: true,
            position: 'top',
            labels: {
                fontColor: '#440a67',
                fontWeight: 'bold'
            }
        },
        tooltips: {
            enabled: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 10,
                    fontColor: '#440a67',
                    fontWeight: 'bold'
                },
                gridLines: {
                    display: false
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Months',
                    fontColor: '#440a67',
                    fontWeight: 'bold'
                },
                ticks: {
                    fontColor: '#440a67',
                    fontWeight: 'bold'
                },
                gridLines: {
                    display: false
                }
            }]
        }
    }
});
