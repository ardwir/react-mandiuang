import palette from 'theme/palette';

export const data = {
  labels: ['1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun'],
  datasets: [
    {
      label: 'Credit',
      backgroundColor: palette.primary.main,
      data: [50000000, 150000000, 100000000, 85000000, 150000000, 275000000, 100000000]
    },
    {
      label: 'Debit',
      backgroundColor: palette.error.main,
      data: [150000000, 175000000, 200000000 , 98000000, 170000000, 88000000, 200000000]
    }
  ]
};

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  legend: { display: false },
  cornerRadius: 20,
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
