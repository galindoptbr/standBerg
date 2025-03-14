import Image from "next/image";
import React from "react";

import profileImage from "../assets/images/profile-image.png";

export const Depositions = () => {
  return (
    <>
      <div className="max-h-[900px] p-4">
        <div className="flex flex-col text-center">
          <span className="text-3xl font-semibold">
            O que nossos clientes dizem
          </span>
          <span className="text-zinc-400">
            Verifique nossas últimas avaliações de clientes e dê seu feedback.
          </span>
        </div>
        <div className="mt-6 max-h-[800px] max-w-[1200px] rounded-md bg-zinc-200 m-auto lg:mt-6 p-4">
          <div className="flex flex-col justify-center gap-8 p-8 lg:flex-row">
            <div className="border-b-2 lg:border-e-2 lg:border-b-0 border-zinc-300">
              <p className="w-80 text-zinc-700 mr-4">
                Comprei meu carro no Seu Stand e fiquei impressionado com o
                atendimento. O vendedor foi super atencioso e me ajudou a
                encontrar o carro ideal para minha família. Recomendo de olhos
                fechados!
              </p>
              <div className="flex gap-4 mt-6">
                <Image
                  className="w-14 mb-4"
                  src={profileImage}
                  alt="imagem de perfil"
                />
                <div className="flex flex-col text-zinc-700">
                  <span className="font-semibold">José Teixeira</span>
                  <span className="text-sm italic">Opel Corsa 2014</span>
                </div>
              </div>
            </div>
            <div className="border-b-2 lg:border-e-2 lg:border-b-0 border-zinc-300">
              <p className="w-80 text-zinc-700 mr-4">
                Adorei a experiência no Seu Stand! Eles foram transparentes em
                todas as etapas e entregaram o carro em perfeitas condições.
                Além disso, o pós-venda foi excelente! Recomendo demais!
              </p>
              <div className="flex gap-4 mt-6">
                <Image
                  className="w-14 mb-4"
                  src={profileImage}
                  alt="imagem de perfil"
                />
                <div className="flex flex-col text-zinc-700">
                  <span className="font-semibold">João Costa</span>
                  <span className="text-sm italic">VW Golf 2022</span>
                </div>
              </div>
            </div>
            <div className="mb-10 lg:mb-0">
              <p className="w-80 text-zinc-700 mr-4">
                Estava em dúvida sobre qual carro escolher, mas no Seu Stand
                recebi toda a orientação necessária. Saí de lá super satisfeito
                com meu novo veículo. Atendimento nota 10! Recomendo!
              </p>
              <div className="flex gap-4 mt-6">
                <Image
                  className="w-14 mb-4"
                  src={profileImage}
                  alt="imagem de perfil"
                />
                <div className="flex flex-col text-zinc-700">
                  <span className="font-semibold">John Doe</span>
                  <span className="text-sm italic">Mercedes CLA 200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
