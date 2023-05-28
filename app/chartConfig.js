
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
    y: 
        {
          id: 'names',
          stacked: true,
          position: {
            y: 1.5
          },
          ticks: {
            // display: false,
            beginAtZero: true,
            font: {
              family: 'Tan Buster',
              size: 30
            },
            // maxRotation: 22.5,
            // minRotation: 22.5,
            color: 'rgb(188,239,246)',

            mirror: true,
            z: 2
          },
          grid: {
            display: false,
            color: 'rgba(75,182,203,0)'
          },
        },
        // {
        //   ticks: {
        //     display: true
        //   }
        // }
        
    x: {
      stacked: true,
      // position: {
      //   y: 20
      // },
      ticks: {
        display: false,
        color: 'rgb(230,227,120)',

      },
      grid: {
        color: 'rgba(75,182,203,0)'
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
      color: 'rgb(242,215,170)',
      font: {
        family: 'Space Grotesk',
        size: 18
      }, 
      position: 'bottom'
    }
  }
}  