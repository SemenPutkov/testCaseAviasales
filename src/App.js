import React, { useEffect, useState } from 'react'
import { Filter } from './component/Filter/Filter'
import { SearchResults } from './component/SearchResults/SearchResults'

const items = [
  { text: 'Все', checked: true, value: 100, allias: 'all' },
  { text: 'Без пересадок', checked: true, value: 0, allias: 'none' },
  { text: '1 пересадка', checked: true, value: 1, allias: 'one' },
  { text: '2 пересадки', checked: true, value: 2, allias: 'two' },
  { text: '3 пересадки', checked: true, value: 3, allias: 'three' }
]

function App() {
  const [filterQuerys, setFilterQuerys] = useState([...items]) // состояние фильтра, через заглушку
  const [rawData, setRawData] = useState([]) // данные с сервера
  const [filterData, setFilterData] = useState([]) // данные соотв-ие фильтрам
  const [outData, setOutData] = useState([]) // данные на экране
  const [searched, setSearched] = useState(false) // флаг запроса на сервер

  useEffect(() => { // обрабатываем кнопку поиска
    if (rawData.length > 0 && !searched) {
      setSearched(true)
    }
    if (rawData.length < 1) {
      setSearched(false)
    }
  }, [rawData, searched])

  useEffect(() => { // первая отрисовка полученных билетов
    if (rawData.length < 1) return
    if (filterData.length > 0) return
    const { options, checked } = createFilterOptions()
    ticketsFilter(rawData, options, checked)
  }, [rawData, filterData])

  function searchHandler() {
    getData(null, 0)
  }

  async function getData(id, count) { // запросы на сервер, long polling
    // поставил ограничение в 5 запросов, если данные к этому моменту не закончились
    if (!id) {
      const res = await fetch('https://front-test.beta.aviasales.ru/search')
      if (res.status !== 200) return new Error('Ошибка получения ID')
      const idData = await res.json()
      id = idData.searchId
    }
    count++
    if (count > 5) return
    const response = await fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${id}`)
    if (response.status === 502) {
      await getData(id, count)
    }
    else if (response.status !== 200) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await getData(id, count)
    } else {
      const data = await response.json()
      setRawData(arr => [...arr, ...data.tickets])
      if (!data.stop) await getData(id, count)
    }
  }

  function ticketsFilter(tickets, options, checked) { //фильтрация билетов: массив билетов, массив опций, флаг галочек
    if (!checked) {
      setFilterData([])
      return displayCountHandler([], [])
    }
    if (options.all) {
      setFilterData(tickets)
      return displayCountHandler([], tickets)
    }

    const filteredTickets = []
    const optArr = []

    if (options.none) {
      optArr.push(Number(0))
    }
    if (options.one) {
      optArr.push(Number(1))
    }
    if (options.two) {
      optArr.push(Number(2))
    }
    if (options.three) {
      optArr.push(Number(3))
    }
    if (optArr.length === 1) {
      tickets.forEach(ticket => {
        let flag = 0
        ticket.segments.forEach(segment => {
          if (segment.stops.length !== optArr[0]) flag++
        })
        if (flag < 1) filteredTickets.push(ticket)
      })
      setFilterData(filteredTickets)
      return displayCountHandler([], filteredTickets)
    }
    tickets.forEach(ticket => {
      const flag = { from: false, to: false }
      ticket.segments.forEach((segment, index) => {
        for (let i = 0; i < optArr.length; i++) {
          if (index === 0) {
            if (flag.from) continue
            if (segment.stops.length === optArr[i]) flag.from = true
          }
          else {
            if (flag.to) continue
            if (segment.stops.length === optArr[i]) flag.to = true
          }
        }
      })
      if (flag.from && flag.to) filteredTickets.push(ticket)
    })
    setFilterData(filteredTickets)
    return displayCountHandler([], filteredTickets)

  }

  function displayCountHandler(displayedItems, items) {
    const arr = [...displayedItems]
    if (items.length > 0) {
      for (let i = displayedItems.length; i < displayedItems.length + 5; i++) {
        arr.push(items[i])
      }
    }
    setOutData([...arr])
  }

  function filterHandler(i) {
    const newQuerys = [...filterQuerys]
    if (newQuerys[i].checked) { // выключаем
      if (i === 0) {
        newQuerys.forEach(query => query.checked = false)
      } else {
        newQuerys[i].checked = false
        newQuerys[0].checked = false
      }
    } else { //включаем
      if (i === 0) {
        newQuerys.forEach(query => query.checked = true)
      } else {
        newQuerys[i].checked = true
        newQuerys[0].checked = false
      }

    }
    setFilterQuerys([...newQuerys])
    const { options, checked } = createFilterOptions()
    if (rawData.length > 0) {
      setOutData([])
      setFilterData([])
      ticketsFilter(rawData, options, checked)
    }
  }
  function createFilterOptions() {
    const options = {}
    let checked = false
    for (let i = 0; i < filterQuerys.length; i++) {
      if (filterQuerys[i].checked) checked = true
      options[filterQuerys[i].allias] = filterQuerys[i].checked
    }
    return { options, checked }
  }

  return (
    <React.Fragment>
      <header>
        <div className='header__image' />
      </header>
      <div className='content'>
        <Filter filterHandler={filterHandler} querys={filterQuerys} />
        <SearchResults items={outData} searched={searched} searchHandler={searchHandler} addItemsHandler={() => displayCountHandler(outData, filterData)} />
      </div>
    </React.Fragment>
  )
}

export default App