// components/MapView.js
import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ accommodations }) => {
  return (
    <Map center={[51.505, -0.09]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {accommodations.map(acc => (
        <Marker key={acc._id} position={[acc.latitude, acc.longitude]}>
          <Popup>
            <strong>{acc.destination}</strong><br />
            {acc.description}
          </Popup>
        </Marker>
      ))}
    </Map>
  );
};

export default MapView;
