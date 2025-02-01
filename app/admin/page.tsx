"use client";

import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
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
import Image from "next/image";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { PiRoadHorizonBold } from "react-icons/pi";
import { BsFuelPump } from "react-icons/bs";
import { TbManualGearboxFilled } from "react-icons/tb";
import {
  MdOutlinePhotoCamera,
  MdOutlineSaveAlt,
} from "react-icons/md";
import { ImageType, Product } from "../src/types/types";
import { AiOutlineCalendar } from "react-icons/ai";

// ---------- Atualize o mapProduct se quiser recuperar os novos campos também ----------
const mapProduct = (docSnap: QueryDocumentSnapshot<DocumentData>): Product => {
  const data = docSnap.data();
  const images =
    data.images && data.images.length
      ? typeof data.images[0] === "object"
        ? data.images.map((img: { url: string }) => img.url)
        : data.images
      : ["/placeholder.jpg"];
  return {
    id: docSnap.id,
    name: data.name || "Produto sem nome",
    price: data.price ? Number(data.price) : 0,
    description: data.description || "Sem descrição",
    images,
    brand: data.brand || "Marca desconhecida",
    kilometers: data.kilometers ? Number(data.kilometers) : 0,
    fuel: data.fuel || "Combustível desconhecido",
    gearbox: data.gearbox || "Câmbio desconhecido",
    power: data.power || "Potência desconhecida",
    top: data.top || false,
    mesAno: data.mesAno || "",
    cor: data.cor || "",
    lugares: data.lugares || "",
    portas: data.portas || "",
    origem: data.origem || "",
    registos: data.registos || "",
    inspecao: data.inspecao || "",
    garantia: data.garantia || "",
  };
};

// ---------- Estado inicial do formulário, agora com os novos campos ----------
const initialFormState = {
  name: "",
  price: "",
  description: "",
  brand: "",
  kilometers: "",
  fuel: "",
  gearbox: "",
  power: "",
  isTop: false,
  mesAno: "",
  cor: "",
  lugares: "",
  portas: "",
  origem: "",
  registos: "",
  inspecao: "",
  garantia: "",
};

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => (
  <div className="relative bg-white rounded-lg p-4 border shadow-sm flex flex-col md:flex-row items-center gap-6">
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
      <h3 className="text-2xl font-bold text-zinc-800">{product.name}</h3>
      <p className="text-lg text-zinc-600">{product.brand}</p>
      <div className="flex items-center gap-4 text-zinc-500 text-sm mt-2">
        <div className="flex items-center gap-1">
          <PiRoadHorizonBold size={18} />
          <p>{new Intl.NumberFormat("de-DE").format(product.kilometers)} km</p>
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
          <AiOutlineCalendar size={18} />
          <p>{product.mesAno}</p>
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
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold"
        >
          Editar
        </button>
        <button
          onClick={(e) => onDelete(e, product.id)}
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
);

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<ImageType[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ---------- Autenticação ----------
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login?error=unauthorized");
    });
    return unsubscribe;
  }, [router]);

  // ---------- Busca os produtos ----------
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

  // ---------- Handlers do formulário ----------
  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setImages([]);
    setPreviewImages([]);
    setEditId(null);
  };

  // ---------- Upload e compressão de imagens ----------
  const uploadImages = async (): Promise<{ url: string; path: string }[]> => {
    if (images.length === 0) {
      return previewImages.map((img) => ({
        url: typeof img === "string" ? img : img.src,
        path: "",
      }));
    }
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1200,
      initialQuality: 0.9,
      useWebWorker: true,
    };
    return Promise.all(
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

  // ---------- Adiciona ou atualiza produto ----------
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
        images: uploadedImages,
        top: form.isTop,
        // Novos campos:
        mesAno: form.mesAno,
        cor: form.cor,
        lugares: form.lugares,
        portas: form.portas,
        origem: form.origem,
        registos: form.registos,
        inspecao: form.inspecao,
        garantia: form.garantia,
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

  // ---------- Deleta produto e suas imagens no Storage ----------
  const handleDeleteProduct = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Tem certeza que deseja deletar este anúncio?")) return;
    try {
      const productSnapshot = await getDocs(collection(db, "products"));
      const productToDelete = productSnapshot.docs.find((doc) => doc.id === id);
      if (productToDelete) {
        const data = productToDelete.data();
        if (
          data.images &&
          data.images.length > 0 &&
          typeof data.images[0] === "object"
        ) {
          await Promise.all(
            data.images.map(async (img: { url: string; path: string }) => {
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
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar o produto:", error);
    }
  };

  // ---------- Prepara edição do produto ----------
  const handleEditProduct = (product: Product) => {
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
      mesAno: product.mesAno || "",
      cor: product.cor || "",
      lugares: product.lugares || "",
      portas: product.portas || "",
      origem: product.origem || "",
      registos: product.registos || "",
      inspecao: product.inspecao || "",
      garantia: product.garantia || "",
    });
    setImages([]);
    setPreviewImages(product.images);
    setEditId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- Handler para seleção de arquivos ----------
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  return (
    <div className="p-6 pt-20 md:pt-44">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Cadastro de Carros
      </h1>
      <div className="flex flex-col max-w-[750px] m-auto">
        {/* Campos de input (não-select) */}
        <input
          type="text"
          placeholder="Modelo"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="number"
          placeholder="Preço de Venda"
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
        <input
          type="text"
          placeholder="Mês/Ano"
          value={form.mesAno}
          onChange={(e) => updateField("mesAno", e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Cor"
          value={form.cor}
          onChange={(e) => updateField("cor", e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Origem"
          value={form.origem}
          onChange={(e) => updateField("origem", e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Registos"
          value={form.registos}
          onChange={(e) => updateField("registos", e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Inspeção Ex: 0000-00-00"
          value={form.inspecao}
          onChange={(e) => updateField("inspecao", e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Garantia Ex: 18 Meses"
          value={form.garantia}
          onChange={(e) => updateField("garantia", e.target.value)}
          className="p-2 mb-2 block"
        />

        {/* Bloco dos selects reposicionado para ficar acima do "Destaque este produto" */}
        <div className="flex flex-col gap-2 mt-4">
          <select
            value={form.fuel}
            onChange={(e) => updateField("fuel", e.target.value)}
            className="p-2 mb-2 block bg-white border rounded"
          >
            <option value="">Combustível</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Gasóleo</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Híbrido">GPL</option>
            <option value="Híbrido">GNV</option>
            <option value="Híbrido">Híbrido/Gasolina</option>
            <option value="Híbrido">Híbrido/Gasóleo</option>
            <option value="Híbrido">Hidrogénio</option>
          </select>
          <select
            value={form.gearbox}
            onChange={(e) => updateField("gearbox", e.target.value)}
            className="p-2 mb-2 block bg-white border rounded"
          >
            <option value="">Tipo de Caixa</option>
            <option value="Manual">Manual</option>
            <option value="Automática">Automática</option>
            <option value="CVT">Semi-Automática</option>
            <option value="CVT">DSG</option>
            <option value="CVT">Tiptronic</option>
            <option value="CVT">Sequencial</option>
            <option value="CVT">Automatizada</option>
          </select>
          <select
            value={form.lugares}
            onChange={(e) => updateField("lugares", e.target.value)}
            className="p-2 mb-2 block bg-white border rounded"
          >
            <option value="">Lugares</option>
            <option value="">2</option>
            <option value="Manual">4</option>
            <option value="Automática">5</option>
            <option value="CVT">6</option>
            <option value="CVT">7</option>
            <option value="CVT">8</option>
            <option value="CVT">9+</option>
          </select>
          <select
            value={form.portas}
            onChange={(e) => updateField("portas", e.target.value)}
            className="p-2 mb-2 block bg-white border rounded"
          >
            <option value="">Portas</option>
            <option value="">2</option>
            <option value="Manual">2</option>
            <option value="Automática">4</option>
            <option value="CVT">5</option>
          </select>
        </div>

        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={form.isTop}
            onChange={(e) => updateField("isTop", e.target.checked)}
            className="w-6 h-6 accent-red-500 cursor-pointer"
          />
          Destaque este produto
        </label>

        <label
          htmlFor="fileInput"
          className="flex justify-center gap-2 bg-zinc-500 text-white text-center font-bold px-4 py-2 mt-4 rounded cursor-pointer"
        >
          <MdOutlinePhotoCamera size={24} />
          Adicionar Fotos
        </label>
        <input
          id="fileInput"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
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
          className={`flex justify-center items-center gap-2 p-2 rounded mt-4 text-zinc-200 font-bold ${
            isLoading
              ? "bg-zinc-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          <MdOutlineSaveAlt size={24} />
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
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
