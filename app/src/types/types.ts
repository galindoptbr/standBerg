import { StaticImageData } from "next/image";

export type ImageType = string | StaticImageData;

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: ImageType[]; // se preferir manter string[], pode deixar assim.
  brand: string;
  kilometers: number;
  fuel: string;
  gearbox: string;
  power: string;
  top?: boolean;
  // Novos campos adicionados:
  mesAno: string;
  cor: string;
  lugares: string;
  portas: string;
  origem: string;
  registos: string;
  inspecao: string;
  garantia: string;
}
