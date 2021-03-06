import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([])
  const [values, setValues] = useState({})
  const [index, setIndex] = useState('')

  const fetchValues = async () => {
    const { data } = await axios.get('/api/values/current')
    console.log('currentDataResponse', data)
    if(typeof data === "object") {
      setValues(data)
    }
  }

  const fetchIndexes = async () => {
    const seenIndexesResponse = await axios.get('/api/values/all')
    console.log('seenIndexesResponse', seenIndexesResponse)
    const data = seenIndexesResponse.data
    if(Array.isArray(data)) {
      setSeenIndexes(data)
    }
  }

  useEffect(() => {
    fetchIndexes()
    fetchValues()
  }, [])
 
  const handleSummit = async (e) => {
    e.preventDefault()
    axios.post('/api/values', {
      index: index
    })
    setIndex('')
  }

  return (
    <div>
      <form onSubmit={handleSummit}>
        <label htmlFor="">Enter your index: </label>
        <input 
          value={index}
          onChange={e => setIndex(e.target.value)}
        /> 
        <button type='submit'>submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {
        seenIndexes.map(({ number }) => number).join(', ')
      }
      <h3>Calculated Values</h3>
      <ul>
      {
         Object.keys(values).map(key => (
           <li key={key}>
             For index {key} I calculated {values[key]}
           </li>
         ))
      }
      </ul>
    </div>
  )
}

export default Fib