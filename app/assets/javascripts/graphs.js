document.addEventListener('turbolinks:load', () => {

  if (document.getElementById('start-calendar')) {
  

    const minDate = (date1, date2) => (date1 < date2) ? date1 : date2
    const maxDate = (date1, date2) => (date1 > date2) ? date1 : date2

    const convertDate = (date) => new Date(new Date(date).setHours(0,0,0,0))

    const START_DATE = convertDate(gon.weight_records[0].date)
    const END_DATE = convertDate(gon.weight_records[gon.weight_records.length - 1].date)

    flatpickr.localize(flatpickr.l10ns.ja)

    const drawGraphForPeriod = () => {
      let from = convertDate(document.getElementById('start-calendar').value)
      let to = convertDate(document.getElementById('end-calendar').value)

      if (from > to) {
        alert('終了日は開始日以降の日付に設定してください')
      }else{
        drawGraph(from, to)
      }

    }

    const periodCalendarOption = {
      disableMobile: true,
      minDate: START_DATE,
      maxDate: END_DATE,
      onChange: drawGraphForPeriod

    }

    const startCalendarFlatpickr = flatpickr('#start-calendar', periodCalendarOption)
    const endCalendarFlatpickr = flatpickr('#end-calendar', periodCalendarOption)

    flatpickr('#new-calendar', {
      disableMobile: true,
      // 記録のある日付を選択できないようにする
      disable: gon.recorded_dates,
      defaultDate: 'today',
  })

    const editCalendar = document.getElementById('edit-calendar')
    const editWeight = document.getElementById('edit-weight')
    const inputWeight = () => {
      let record = gon.weight_records.find((record) => record.date === editCalendar.value)
      editWeight.value = record.weight
    }

    flatpickr('#edit-calendar', {
      disableMobile: true,
      enable: gon.recorded_dates,
      noCalendar: gon.recorded_dates.length === 0,
      onChange: inputWeight
    })
    
    const TODAY = convertDate(new Date())
    const A_WEEK_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 6)
    const TWO_WEEK_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 13) 
    const A_MONTH_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, TODAY.getDate() + 1)
    const THREE_MONTH_AGO = new Date(TODAY.getFullYear(), TODAY.getMonth() - 3, TODAY.getDate() + 1)

     // グラフを描く場所を取得
    const chartWeightContext = document.getElementById("chart-weight").getContext('2d')

    let chartWeight

    // 期間を指定してグラフを描く
    const drawGraph = (from, to) => {
      // from から to までの期間のデータに絞る
      let records = gon.weight_records.filter((record) => {
        let date = convertDate(record.date)
        return from <= date && date <= to
      })

      // 日付のみのデータを作成
      let dates = records.map((record) => {
          // 横軸のラベル表示は簡潔にしたいので，
           // 日付 2020-01-08 を 1/8 のような形式に変換する
        return record.date.replace(/^\d+-0*(\d+)-0*(\d+)$/, '$1/$2')
      })

      // 体重のみのデータを作成
      let weights = records.map((record) => record.weight)

      let weightData = {
        labels: dates,
        datasets: [{
          label: '体重(kg)',
          data: weights,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          spanGaps: true
        }]
      }

      let weightOption = {
        tooltips: {
          callbacks: {
            title: function (tooltipItems){
              return tooltipItems[0].xLabel.replace(/^(\d+).(\d+)$/, ' $1 月 $2 日')
            },
            label: function (tooltipItems){
              return '体重: ' + tooltipItems.yLabel + 'kg'
            }
          }
        }
      }

      if (!chartWeight) {
        chartWeight = new Chart(chartWeightContext, {
          type: 'line',
          data: weightData,
          options: weightOption
        })
      }else{
        chartWeight.data = weightData
        chartWeight.options = weightOption
        chartWeight.update()
      }
    }

    const drawGraphToToday = (from) => {
      form = maxDate(from, START_DATE)
      let to = minDate(TODAY,END_DATE)
      drawGraph(from, to)
      startCalendarFlatpickr.setDate(from)
      endCalendarFlatpickr.setDate(to)
    }

    


    document.getElementById('a-week-button').addEventListener('click', () =>{
      drawGraphToToday(A_WEEK_AGO)
    })

    document.getElementById('two-week-button').addEventListener('click', () =>{
      drawGraphToToday(TWO_WEEK_AGO)
    })

    document.getElementById('a-month-button').addEventListener('click', () =>{
      drawGraphToToday(A_MONTH_AGO)
    })

    document.getElementById('three-months-button').addEventListener('click', () =>{
      drawGraphToToday(THREE_MONTH_AGO)
    })
  
    // グラフの初期表示
    drawGraphToToday(A_WEEK_AGO)
  }
})