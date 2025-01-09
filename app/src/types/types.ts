import { StaticImageData } from "next/image";

export type ImageType = string | StaticImageData;

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  brand: string;
  kilometers: number;
  fuel: string;
  gearbox: string;
  power: string;
  top?: boolean;
}
