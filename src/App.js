import './App.css'
import React, { useEffect, useRef, useState } from 'react'
import { FormControl, Select, MenuItem, Card, CardContent } from '@mui/material'
import axios from 'axios'
import InfoBox from './Components/InfoBox'
import Map from './Components/Map'
import Table from './Components/Table'
import LineGraph from './Components/LineGraph'
import { sortData } from './utils/sortData'
import 'leaflet/dist/leaflet.css'

function App() {
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState('worldwide')
    const [countryInfo, setCountryInfo] = useState([])
    const [tableData, setTableData] = useState([])
    const [casesType, setCasesType] = useState('cases')
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
    const [mapZoom, setMapZoom] = useState(3)
    const mapRef = useRef()

    useEffect(() => {
        const getCountriesData = async () => {
            await axios
                .get('https://disease.sh/v3/covid-19/countries')
                .then(response => {
                    const countries = response.data.map(country => ({
                        name: country.country,
                        value: country.countryInfo.iso2
                    }))

                    const sortedData = sortData(response.data)
                    setCountries(countries)
                    setTableData(sortedData)
                })
        }
        getCountriesData()
    })

    useEffect(() => {
        axios.get('https://disease.sh/v3/covid-19/all').then(response => {
            const { data } = response

            setCountryInfo(data)
        })
    })

    const onCountryChange = async e => {
        const { value } = e.target
        setCountry(value)

        await axios
            .get(`https://disease.sh/v3/covid-19/countries/${value}`)
            .then(response => {
                const { data } = response
                setCountryInfo(data)
                setMapCenter([data.countryInfo.lat, data.countryInfo.long])
                setMapZoom(4)
            })
    }

    return (
        <div className='app'>
            <div className='app__left'>
                <div className='app__header'>
                    <h1>COVID-19-TRACKER</h1>
                    <FormControl className='app__dropdown'>
                        <Select
                            variant='outlined'
                            value={country}
                            onChange={onCountryChange}
                        >
                            <MenuItem value='worldwide'>WorldWide</MenuItem>
                            {countries.map(country => (
                                <MenuItem value={country.value}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className='app__stats'>
                    <InfoBox
                        title='Coronavirus cases'
                        cases={countryInfo.todayCases}
                        total={countryInfo.cases}
                    ></InfoBox>
                    <InfoBox
                        title='Recovered'
                        cases={countryInfo.todayRecovered}
                        total={countryInfo.recovered}
                    ></InfoBox>
                    <InfoBox
                        title='Deaths'
                        cases={countryInfo.todayDeaths}
                        total={countryInfo.deaths}
                    ></InfoBox>
                </div>

                <Map ref={mapRef} center={mapCenter} zoom={mapZoom}></Map>
            </div>

            <Card className='app__right'>
                <CardContent>
                    <h3>Live cases by Country</h3>
                    <Table countries={tableData}></Table>
                    <LineGraph casesType={casesType}></LineGraph>
                </CardContent>
            </Card>
        </div>
    )
}

export default App
