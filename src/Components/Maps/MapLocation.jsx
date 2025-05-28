import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MapLocation = ({ longitude, latitude }) => {
  // Asegúrate de que las coordenadas son válidas
  if (!longitude || !latitude || longitude === 0 || latitude === 0) {
    return <p>Coordenadas no válidas o no proporcionadas.</p>;
  }

  const position = [latitude, longitude]; // Leaflet usa [lat, lng]

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '30vh', width: '100%' , zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
           Creacion de Reporte
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapLocation;
