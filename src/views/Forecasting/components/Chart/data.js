import palette from 'theme/palette';

export const data = {
  labels: ['Jan20', 'Feb20', 'Mar20', 'Apr20', 'May20', 'Jun20', 'Jul20', 'Aug20', 'Sep20', 'Oct20', 'Nov20', 'Dec20'],
  datasets: [
    {
      label: 'Balance',
      backgroundColor: palette.primary.main,
      data: [10000000, 15000000, 10000000, 20000000, 15000000, 15000000, 10000000, 0, 0, 0, 0, 0]
    },
    {
      label: 'Forecast',
      backgroundColor: palette.error.main,
      data: [0, 0, 0, 0, 0, 0, 11000000, 18500000, 16000000, 9500000, 12000000, 18000000]
    }
  ]
};

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  legend: { display: false },
  cornerRadius: 10,
  tooltips: {
    enabled: true,
    mode: 'index',
    intersect: false,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: palette.white,
    titleFontColor: palette.text.primary,
    bodyFontColor: palette.text.secondary,
    footerFontColor: palette.text.secondary
  },
  layout: { padding: 0 },
  scales: {
    xAxes: [
      {
        barThickness: 12,
        maxBarThickness: 10,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
        ticks: {
          fontColor: palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: palette.divider
        }
      }
    ]
  }
};
