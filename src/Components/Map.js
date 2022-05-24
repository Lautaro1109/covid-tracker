import React, { useEffect } from 'react'
import '../App.css'
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet'

const Map = ({ center, zoom }) => {
    const ChangeMap = ({ center, zoom }) => {
        const map = useMap()
        map.setView(center, zoom)
    }

    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <ChangeMap center={center} zoom={zoom} />
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'></TileLayer>
            </LeafletMap>
        </div>
    )
}

export default Map
