"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Estilos para o container do mapa
const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
  overflow: "hidden",
};

// Coordenadas do stand (latitude e longitude)
const center: [number, number] = [41.5387, -8.6158];

// Configuração do ícone padrão do marcador
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Como o código pode ser carregado em ambiente onde "window" não existe,
// fazemos essa configuração condicionalmente.
if (typeof window !== "undefined") {
  L.Marker.prototype.options.icon = defaultIcon;
}

const LocationMap = () => {
  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={false}
      style={containerStyle}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>Stand aqui!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;
