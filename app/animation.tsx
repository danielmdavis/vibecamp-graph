
const colors = {
  pink: 'rgb(233,102,170)',
  orange: 'rgb(239,103,69)',
  yellow: 'rgb(250,210,85)',
  green: 'rgb(53,124,94)',
  blue2: 'rgb(188,239,246)',
  blue1: 'rgb(66,174,239)',
  purple: 'rgb(86,27,90)',
  black: 'rgb(46,36,37)'
}

// sequence builders
export function calcDataOffsetSequence(current: number, history: any) {
  let dataOffsetSequence: any = []
  dataOffsetSequence.push(history[0] - current)
  for (let i = 1; i < history.length; i += 1) {
    dataOffsetSequence.push(history[i] - history[i - 1])
  }
  dataOffsetSequence.push(current - history[history.length - 1])
  return dataOffsetSequence
}
export function calcMobileDataOffsetSequence(current: number, history: any) {
  let dataOffsetSequence: any = []
  dataOffsetSequence.push(history[0] - current)
  for (let i = 1; i < history.length; i += 1) {
    dataOffsetSequence.push(history[i] - history[i - 1])
  }
  dataOffsetSequence.push(current - history[history.length - 1])
  dataOffsetSequence = dataOffsetSequence.map((offset: number) => { return offset / 2})
  return dataOffsetSequence
}

export function calcAllDOS(sequence: any, current: any, history: any) {
  let allDOS: any = []
  for (let i = 0; i < current.length; i += 1) {
    allDOS.push(sequence(current[i], history[i]))
  }
  return allDOS
}

// colors current winner at t
export function checkAndSetWinner(chartData: any, chart: any, currentArr: any) {

  let colorArr = new Array(currentArr.length - 1).fill(colors.blue1)
  for (let i = 0; i < chartData.length; i += 1) {
    if (chartData[i] === Math.max(...chartData)) {
      colorArr[i] = colors.pink
    } else {
      colorArr[i] = colors.blue1
    }
  }
  chart.data.datasets[0].backgroundColor = colorArr
}

// pads each history to be the same length
export function historyStabilizer(labels: any, userData: any) {

  let historyArr = labels.map((nomen: string) => userData.filter((item: any) => { return item.name === nomen})[0].history)
  const historyLengths = historyArr.map((each: any[]) => { return each.length })
  const greatestHistoryLength = Math.max(...historyLengths)
  historyArr = historyArr.map((each: any) => {
    let array = Array(greatestHistoryLength - each.length).fill(0)
    return array.concat(each)
  })
  return historyArr
}

// sequence runners
export function setChartlessDate(dateData?: any) {
  const date = new Date(dateData + 'T00:00')
  const today = new Date()
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dateString = `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
  const todayString = `${months[today.getMonth()]} ${today.getDate()} ${today.getFullYear()}`
  if (dateData === undefined) {
    return todayString
  } else if (dateData !== undefined ) {
    return dateString
  }
}

export function setVoteAndScore(setVoteCount: any, setScoreTotal: any, currentArr: any, currentVotes: any) {
  setVoteCount(currentVotes)
  setScoreTotal(currentArr.reduce((total: number, curr: number) => total + curr, 0))
}

export function staticizePip(chart: any) {
  if (chart !== null && chart.data.datasets[1]) {
    chart.options.animation.duration = 0
    chart.data.datasets[1].data.forEach((datum: any) => { // not working yet
      datum = -4
    })
  }
}

export function adjustDataOneStep(currentArr: any, stepArr: any, chart: any, speed: any) {
  for (let i = 0; i < chart.data.datasets[0].data.length; i += 1) {
    chart.options.animation.duration = speed
    chart.data.datasets[0].data[i] += stepArr[i]
    // console.log(chart.data?.datasets[0].data)
  }
  checkAndSetWinner(chart.data.datasets[0].data, chart, currentArr)
}

export function calcAnimationSpeed(historyArr: any) {
  const stepCount = historyArr[0].length + 1
  const timePerStep = 5500 / stepCount
  return timePerStep
}

// export function adjustFooterOneStep(currentVotes: any, currentArr: any, voters: any, dateData?: any) {
//   const date = document.getElementById('date')
//   const votes = document.getElementById('votes')
//   const points = document.getElementById('points')
//   const turnout = document.getElementById('turnout')

//   const totalVotes = currentArr.reduce((total: number, curr: number) => total + curr, 0)
//   if (date !== null) { 
//     date.textContent = setChartlessDate(dateData)
//   }
//   if ( votes !== null) {
//     votes.textContent = currentVotes
//   }
//   if ( points !== null) {
//     points.textContent = `votes cast (${totalVotes})`
//   }
//   if ( turnout !== null && totalVotes / voters < 3) {
//     turnout.textContent = (totalVotes / voters).toFixed(1)
//   } else if (turnout !== null) {
//     turnout.textContent = Math.round(totalVotes / voters).toString()
//   }
// }

export function isRunning(delayOffset: number, delayCount: number, historyArr: any, setState: any) {
  setState(true)
  const disableDuration = delayOffset + calcAnimationSpeed(historyArr) * (delayCount + 0.5)
  setTimeout(() => {
    setState(false)
  }, disableDuration)
}

export function animateAll(currentArr: any[], DOSArrs: any[], chart: any, historyArr: any[], setState: any, adjustFooterOneStep: any, dateData: any, voters: number, visiblePipArr: any) {
  let delayOffset = 250
  isRunning(delayOffset, DOSArrs[0].length, historyArr, setState)
  const dates = dateData?.sort()
  let currentVotes = 1
  for (let i = 0; i < DOSArrs[0].length - 1; i += 1) {
    const speed: any = i === 0 ? 0 : undefined
    setTimeout(() => {
      const step = DOSArrs.map((n: any) => n = n[i])
      adjustDataOneStep(currentArr, step, chart, speed)
      adjustFooterOneStep(currentVotes, currentArr, voters, dates[i])
      currentArr = currentArr.map((n: number, j: number) => n += step[j])
      if (i === DOSArrs[0].length - 2) { // when complete, reset all to blue
        const colorArr = new Array(currentArr.length - 1).fill(colors.blue1)
        chart.data.datasets[0].backgroundColor = colorArr
      }
      chart.update()
      currentVotes += 1
    }, delayOffset)
    delayOffset += calcAnimationSpeed(historyArr)
  }
}

 
 export function isMobile() { // checks mobility, halves offset to correct bug (unused, on standby for if bug recurs)
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor)
  return check;
}

export function whichDOS(isMobile: any, allMobileDOS: any, allDOS: any) {
  if (isMobile()) {
    return allMobileDOS
  } else {
    return allDOS
  }
}