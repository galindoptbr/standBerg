"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db, storage, app } from "../src/services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Product } from "../src/types/types";
import Image from "next/image";
import Link from "next/link";
import imageCompression from "browser-image-compression";

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [kilometers, setKilometers] = useState<number | string>("");
  const [fuel, setFuel] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [power, setPower] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login?error=unauthorized"); // Passa um parâmetro de erro
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));

      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        const product: Product = {
          id: doc.id,
          name: data.name || "Produto sem nome",
          price: data.price ? Number(data.price) : 0,
          description: data.description || "Sem descrição",
          images:
            data.images && data.images.length
              ? data.images
              : ["/placeholder.jpg"],
          brand: data.brand || "Marca desconhecida",
          kilometers: data.kilometers ? Number(data.kilometers) : 0,
          fuel: data.fuel || "Combustivel desconhecido",
          gearbox: data.gearbox || "Cambio desconhecido",
          power: data.power || "Potencia desconhecida",
          top: data.top || false,
        };

        return product;
      });

      setProducts(productsData);
    } catch (error) {
      console.error("Erro ao buscar os produtos: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    setIsLoading(true);

    try {
      let imageUrls = previewImages;

      if (images.length > 0) {
        imageUrls = await Promise.all(
          images.map(async (image) => {
            const options = {
              maxSizeMB: 2,
              maxWidthOrHeight: 1200,
              initialQuality: 0.9,
              useWebWorker: true,
            };

            try {
              const compressedImage = await imageCompression(image, options);

              const storageRef = ref(
                storage,
                `products/${compressedImage.name}-${Date.now()}`
              );
              await uploadBytes(storageRef, compressedImage);
              const url = await getDownloadURL(storageRef);
              return url;
            } catch (error) {
              console.error("Erro ao comprimir a imagem:", error);
              throw error;
            }
          })
        );
      }

      const productData = {
        name,
        price: Number(price),
        description,
        brand,
        kilometers,
        fuel,
        gearbox,
        power,
        images: imageUrls,
        top: false,
      };

      if (editId) {
        const productRef = doc(db, "products", editId);
        await updateDoc(productRef, productData);
        setEditId(null);
      } else {
        await addDoc(collection(db, "products"), productData);
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Erro ao cadastrar o produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Tem certeza que deseja deletar este anúncio?"
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Erro ao deletar o produto: ", error);
    }
  };

  const handleEditProduct = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    event.stopPropagation();

    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setBrand(product.brand);
    setKilometers(product.kilometers);
    setFuel(product.fuel);
    setGearbox(product.gearbox);
    setPower(product.power);
    setImages([]);
    setPreviewImages(product.images);
    setEditId(product.id);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setBrand("");
    setKilometers("");
    setFuel("");
    setGearbox("");
    setPower("");
    setImages([]);
    setPreviewImages([]);
    setEditId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Cadastro de Carros
      </h1>
      <div className="flex flex-col max-w-[750px] m-auto">
        <input
          type="text"
          placeholder="Modelo da Viatura"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 mb-2 block"
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Marca"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="number"
          placeholder="Quilometragem"
          value={kilometers}
          onChange={(e) => setKilometers(e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Combustível"
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Tipo de Caixa"
          value={gearbox}
          onChange={(e) => setGearbox(e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Potência"
          value={power}
          onChange={(e) => setPower(e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              setImages(files);

              const previews = files.map((file) => URL.createObjectURL(file));
              setPreviewImages(previews);
            }
          }}
          className="p-2 mb-2 block"
        />

        {previewImages.length > 0 && (
          <div className="flex gap-2 mt-4">
            {previewImages.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Pré-visualização ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
        <button
          onClick={handleAddProduct}
          className={`p-2 rounded mt-4 text-zinc-200 font-bold ${
            isLoading
              ? "bg-zinc-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {isLoading
            ? "Processando..."
            : editId
            ? "Atualizar Carro"
            : "Cadastrar Carro"}
        </button>
      </div>

      <div className="mt-8 max-w-[1200px] m-auto">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Carros Cadastrados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2 lg:p-0">
          {products.map((product) => (
            <div key={product.id} className="bg-zinc-100 rounded-lg p-4 border">
              {product.images && product.images.length > 0 && (
                <Image
                  src={product.images[0]}
                  alt={`Imagem do produto ${product.name}`}
                  width={300}
                  height={300}
                  className="w-full object-contain rounded"
                  priority
                />
              )}
              <div className="flex flex-col items-center mt-4">
                <h3 className="text-2xl font-bold text-zinc-700">
                  {product.name}
                </h3>
                <p className="text-zinc-500 pt-2">{product.brand}</p>
                <p className="flex items-center gap-1 mt-2 text-2xl font-semibold text-zinc-700">
                  {new Intl.NumberFormat("de-DE").format(product.price)}{" "}
                  <span className="text-sm">EUR</span>
                </p>
                <div className="flex gap-1 text-zinc-400 text-xs">
                  <p>
                    {new Intl.NumberFormat("de-DE").format(product.kilometers)}{" "}
                    km
                  </p>
                  ·<p>{product.fuel}</p>·<p>{product.gearbox}</p>·
                  <p>{product.power} cv</p>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={(e) => {
                      handleEditProduct(e, product);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-md font-bold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleDeleteProduct(e, product.id)}
                    className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-md font-bold"
                  >
                    Deletar
                  </button>
                </div>
                <Link href={`/product/${product.id}`}>
                  <button className="bg-zinc-500 hover:bg-zinc-700 p-2 rounded-md font-bold w-40 mt-4">
                    <span className="text-white">Ver Anúncio</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
