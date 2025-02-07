"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

L.Marker.prototype.options.icon = defaultIcon;

const Location = () => {
  return (
    <div className="w-full m-auto p-8 lg:p-10 bg-zinc-50 relative z-10">
      <h1 className="text-3xl font-semibold text-center text-zinc-700">
        Onde nos encontrar
      </h1>
      <p className="text-zinc-500 text-md text-center">
        Veja a localização do nosso stand e entre em contato conosco.
      </p>

      <div className="max-w-[1200px] m-auto grid grid-cols-1 lg:grid-cols-2 pt-6 p-2 lg:p-0 mt-10 mb-10">
        {/* Mapa usando OpenStreetMap via Leaflet */}
        <div className="w-full h-[400px] bg-zinc-300 rounded-t-lg lg:rounded-none lg:rounded-l-lg overflow-hidden border border-zinc-200">
          <MapContainer
            center={center}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={center}>
              <Popup>Stand aqui!</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Informações de contato */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-b-lg lg:rounded-none lg:rounded-r-lg p-6 pt-14">
          <h2 className="text-3xl font-semibold text-zinc-600">Endereço</h2>
          <p className="text-zinc-500 text-lg mt-2">
            Rua Exemplo, 123 - Barcelos, Portugal
          </p>

          <h3 className="text-2xl font-semibold text-zinc-600 mt-4">
            Contatos
          </h3>
          <p className="text-zinc-500 text-lg">📞 Telefone: +351 912 345 678</p>
          <p className="text-zinc-500 text-lg">📧 Email: contato@stand.pt</p>

          <h3 className="text-xl font-semibold text-zinc-600 mt-4">
            Horário de Funcionamento
          </h3>
          <p className="text-zinc-500 text-lg">🕘 Seg - Sex: 9h às 18h</p>
          <p className="text-zinc-500 text-lg">🕘 Sábado: 9h às 13h</p>
        </div>
      </div>
    </div>
  );
};

export default Location;