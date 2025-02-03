"use client";

import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
  overflow: "hidden",
};

const center = {
  lat: 41.5387, // Latitude real do stand
  lng: -8.6158, // Longitude real do stand
};

const Location = () => {
  return (
    <div className="max-full m-auto p-8 lg:p-10 bg-zinc-50">
      <h1 className="text-3xl font-semibold text-center">Onde nos encontrar</h1>
      <p className="text-zinc-500 text-md text-center">
        Veja a localização do nosso stand e entre em contato conosco.
      </p>

      <div className="max-w-[1200px] m-auto grid grid-cols-1 lg:grid-cols-2 pt-6 p-2 lg:p-0 mt-10 mb-10">
        {/* Mapa do Google */}
        <div className="w-full h-[400px] bg-zinc-300 rounded-t-lg lg:rounded-none lg:rounded-l-lg overflow-hidden border border-zinc-200">
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
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
