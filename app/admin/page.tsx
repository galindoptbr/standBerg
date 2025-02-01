"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, storage, app } from "../src/services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { PiRoadHorizonBold } from "react-icons/pi";
import { BsFuelPump } from "react-icons/bs";
import { TbManualGearboxFilled } from "react-icons/tb";
import { MdOutlineSpeed } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { Product } from "../src/types/types";

// Modifique o mapProduct para suportar ambos os esquemas (antigo e novo)
const mapProduct = (doc: QueryDocumentSnapshot<DocumentData>): Product => {
  const data = doc.data();
  // Se o campo "images" for um array de objetos, extraia somente a URL.
  const images =
    data.images && data.images.length
      ? typeof data.images[0] === "object"
        ? data.images.map((img: { url: string }) => img.url)
        : data.images
      : ["/placeholder.jpg"];
  return {
    id: doc.id,
    name: data.name || "Produto sem nome",
    price: data.price ? Number(data.price) : 0,
    description: data.description || "Sem descrição",
    images,
    brand: data.brand || "Marca desconhecida",
    kilometers: data.kilometers ? Number(data.kilometers) : 0,
    fuel: data.fuel || "Combustivel desconhecido",
    gearbox: data.gearbox || "Cambio desconhecido",
    power: data.power || "Potencia desconhecida",
    top: data.top || false,
  };
};

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    kilometers: "",
    fuel: "",
    gearbox: "",
    power: "",
    isTop: false,
  });
  const [images, setImages] = useState<File[]>([]);
  // previewImages continua sendo um array de URLs para visualização (não necessariamente com path)
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Autenticação
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login?error=unauthorized");
      }
    });
    return unsubscribe;
  }, [router]);

  // Fetch dos produtos
  const fetchProducts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(mapProduct);
      setProducts(productsData);
    } catch (error) {
      console.error("Erro ao buscar os produtos:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Atualiza campos do formulário
  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Reseta o formulário
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      brand: "",
      kilometers: "",
      fuel: "",
      gearbox: "",
      power: "",
      isTop: false,
    });
    setImages([]);
    setPreviewImages([]);
    setEditId(null);
  };

  // Upload e compressão das imagens
  // Agora retorna um array de objetos { url, path }
  const uploadImages = async (): Promise<{ url: string; path: string }[]> => {
    if (images.length === 0) {
      // Se não houver novas imagens, assumimos que o previewImages já vem do produto antigo.
      // Porém, nesse caso, os paths não estão disponíveis. Você pode optar por manter esses dados.
      return previewImages.map((url) => ({ url, path: "" }));
    }
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1200,
      initialQuality: 0.9,
      useWebWorker: true,
    };
    return await Promise.all(
      images.map(async (image) => {
        try {
          const compressedImage = await imageCompression(image, options);
          const path = `products/${compressedImage.name}-${Date.now()}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, compressedImage);
          const url = await getDownloadURL(storageRef);
          return { url, path };
        } catch (error) {
          console.error("Erro ao comprimir a imagem:", error);
          throw error;
        }
      })
    );
  };

  // Adiciona ou atualiza produto
  const handleAddProduct = async () => {
    setIsLoading(true);
    try {
      const uploadedImages = await uploadImages();

      const productData = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        brand: form.brand,
        kilometers: form.kilometers,
        fuel: form.fuel,
        gearbox: form.gearbox,
        power: form.power,
        // Salva o array de objetos (cada objeto tem url e path)
        images: uploadedImages,
        top: form.isTop,
      };

      if (editId) {
        await updateDoc(doc(db, "products", editId), productData);
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

  // Deleta produto e também suas imagens do Storage
  const handleDeleteProduct = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Tem certeza que deseja deletar este anúncio?")) return;
    try {
      // Primeiro, busque o produto completo para ter os paths
      const productDoc = await getDocs(collection(db, "products"));
      const productToDelete = productDoc.docs.find((doc) => doc.id === id);
      if (productToDelete) {
        const data = productToDelete.data();
        // Se os dados foram salvos com o novo esquema, data.images deve ser um array de objetos
        if (
          data.images &&
          data.images.length > 0 &&
          typeof data.images[0] === "object"
        ) {
          await Promise.all(
            data.images.map(async (img: { url: string; path: string }) => {
              // Só tenta deletar se o path estiver disponível
              if (img.path) {
                const imageRef = ref(storage, img.path);
                try {
                  await deleteObject(imageRef);
                } catch (error) {
                  console.error("Erro ao deletar imagem do Storage:", error);
                }
              }
            })
          );
        }
      }

      // Exclui o documento do Firestore
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar o produto:", error);
    }
  };

  // Prepara edição do produto
  const handleEditProduct = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.stopPropagation();
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      brand: product.brand,
      kilometers: product.kilometers.toString(),
      fuel: product.fuel,
      gearbox: product.gearbox,
      power: product.power,
      isTop: product.top || false,
    });
    setImages([]);
    // Como no Firestore as imagens estão salvas como array de objetos, vamos extrair só as URLs para o preview
    setPreviewImages(product.images);
    setEditId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 pt-20 md:pt-44">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Cadastro de Carros
      </h1>
      <div className="flex flex-col max-w-[750px] m-auto">
        <input
          type="text"
          placeholder="Modelo da Viatura"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="number"
          placeholder="Preço"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          className="p-2 mb-2 block"
        />
        <textarea
          placeholder="Descrição"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Marca"
          value={form.brand}
          onChange={(e) => updateField("brand", e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="number"
          placeholder="Quilometragem"
          value={form.kilometers}
          onChange={(e) => updateField("kilometers", e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Potência"
          value={form.power}
          onChange={(e) => updateField("power", e.target.value)}
          className="p-2 mb-2 block"
        />
        <select
          value={form.fuel}
          onChange={(e) => updateField("fuel", e.target.value)}
          className="p-2 mb-2 block bg-white border rounded"
        >
          <option value="">Selecione o Combustível</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Diesel">Diesel</option>
          <option value="Elétrico">Elétrico</option>
          <option value="Híbrido">Híbrido</option>
        </select>
        <select
          value={form.gearbox}
          onChange={(e) => updateField("gearbox", e.target.value)}
          className="p-2 mb-2 block bg-white border rounded"
        >
          <option value="">Selecione o Tipo de Caixa</option>
          <option value="Manual">Manual</option>
          <option value="Automática">Automática</option>
          <option value="CVT">CVT</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isTop}
            onChange={(e) => updateField("isTop", e.target.checked)}
            className="p-2"
          />
          Destaque este produto
        </label>
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
                width={96}
                height={96}
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
        <div className="flex flex-col gap-4 p-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-lg p-4 border shadow-sm flex flex-col md:flex-row items-center gap-6"
            >
              {product.images && product.images.length > 0 && (
                <Image
                  src={product.images[0]}
                  alt={`Imagem do produto ${product.name}`}
                  width={200}
                  height={140}
                  className="w-[200px] h-[140px] object-cover rounded-lg"
                  priority
                />
              )}
              <div className="flex flex-col flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-zinc-800">
                  {product.name}
                </h3>
                <p className="text-lg text-zinc-600">{product.brand}</p>
                <div className="flex items-center gap-4 text-zinc-500 text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <PiRoadHorizonBold size={18} />
                    <p>
                      {new Intl.NumberFormat("de-DE").format(
                        product.kilometers
                      )}{" "}
                      km
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <BsFuelPump size={18} />
                    <p>{product.fuel}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TbManualGearboxFilled size={18} />
                    <p>{product.gearbox}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdOutlineSpeed size={18} />
                    <p>{product.power} cv</p>
                  </div>
                </div>
                {product.top && (
                  <div className="mt-2">
                    <span className="px-2 py-1 text-xs text-red-600 bg-red-100 rounded">
                      Novidade 🔥
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-2xl font-bold text-zinc-800">
                  {new Intl.NumberFormat("de-DE").format(product.price)} EUR
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleEditProduct(e, product)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleDeleteProduct(e, product.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold"
                  >
                    Deletar
                  </button>
                </div>
                <Link href={`/product/${product.id}`}>
                  <button className="bg-zinc-500 hover:bg-zinc-700 p-2 rounded-md font-bold w-40 mt-2 text-white">
                    Ver Anúncio
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
