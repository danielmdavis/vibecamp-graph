
export const chartConfig = { 
  responsive: true,
  maintainAspectRatio: false,
  events: [],
  indexAxis: 'y',
  animations: {
    tension: {
      duration: 5500,
      easing: 'easeOutBounce'
    }
  },
  scales: {
    y: {
      ticks: {
        beginAtZero: true,
        font: {
          family: 'Space Grotesk',
          size: 14
        },
        maxRotation: 22.5,
        minRotation: 22.5,
        color: 'rgb(46,36,37)'
      },
      grid: {
        color: 'rgb(75,182,203)'
      },
    },
    x: {
      max: 100,
      ticks: {
        display: false,
        color: 'rgb(230,227,120)'
      },
      grid: {
        color: 'rgb(75,182,203)'
      }
    }
  },
  plugins: {
    legend: {
      display: false,
      position: 'bottom',
      labels: {
        color: 'rgb(230,227,120)',
        font: {
          family: 'Space Grotesk'
        }, 
      }
    },
    title: {
      display: true,
      text: 'Click to see the full history of romantic acclaim',
      color: 'rgb(46,36,37)',
      font: {
        family: 'Space Grotesk',
        size: 18
      }, 
      position: 'bottom'
    }
  }
}  