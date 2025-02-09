"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FormData {
  name: string;
  phone: string;
  email: string;
  carYear: string;
  amount: string;
  installments: string;
  message?: string;
  terms: boolean;
  honeypot?: string;
  file?: FileList;
}

const IntermediationPage = () => {
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    reset, // Adicionado reset para limpar o formulário
    formState: { errors },
  } = useForm<FormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (data.honeypot) {
      console.warn("Tentativa de envio bloqueada por bot.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("carYear", data.carYear);
    formData.append("amount", data.amount);
    formData.append("installments", data.installments);
    formData.append("message", data.message || "");
    formData.append("terms", data.terms.toString());

    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    const response = await fetch("/api/intermediation", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Formulário enviado com sucesso!");
      reset(); // Limpa o formulário após o envio
    } else {
      alert("Erro ao enviar o formulário.");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <div className="flex gap-2 md:mt-44 mt-24 pl-10 m-auto max-w-[1200px]">
        <ul className="flex gap-2">
          <li>
            <Link
              href="/"
              replace
              className={`transition-colors duration-300 ${
                pathname === "/"
                  ? "text-yellow-500"
                  : "text-zinc-400 hover:text-red-500"
              }`}
            >
              Início /
            </Link>
          </li>
          <li>
            <Link
              href="/intermediation"
              className={`transition-colors duration-300 ${
                pathname === "/intermediation"
                  ? "text-zinc-400"
                  : "text-zinc-400 hover:text-red-500"
              }`}
            >
              Intermediação de Crédito
            </Link>
          </li>
        </ul>
      </div>

      <div className="max-w-[1200px] mx-auto mb-36 p-4 lg:p-0">
        <div className="flex flex-col text-center mt-12">
          <h1 className="text-3xl font-semibold text-red-600">
            Intermediação de Crédito
          </h1>
          <p className="text-zinc-600 max-w-[956px] mx-auto mt-2 p-2 lg:p-0">
            Preencha o formulário abaixo para solicitar seu financiamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
          <div className="bg-gray-100 p-6 text-zinc-700">
            <h2 className="text-xl font-semibold text-red-600">
              Documentos necessários para financiamento a particulares
            </h2>
            <ul className="mt-3 list-disc list-inside">
              <li>
                Cópia de cartão de cidadão ou Bilhete de Identidade e Número de
                Contribuinte;
              </li>
              <li>IBAN pessoal;</li>
              <li>Comprovativo de morada (fatura de luz ou água);</li>
              <li>
                Cópia do último recibo de vencimento ou 2 recibos dos últimos 4
                meses;
              </li>
              <li>Cópia da carta de condução;</li>
              <li>Contato telefônico;</li>
              <li>Último Modelo 3 de IRS entregue.</li>
            </ul>

            <h2 className="text-xl font-semibold text-red-600 mt-6">
              Documentos necessários para financiamento a Empresas
            </h2>
            <ul className="mt-3 list-disc list-inside">
              <li>IBAN da empresa;</li>
              <li>Comprovativo de morada (fatura de luz ou água);</li>
              <li>Código Certidão Permanente;</li>
              <li>Último Mod.22;</li>
              <li>Última IES;</li>
              <li>Último Balançete Geral;</li>
              <li>Contato Telefônico;</li>
              <li>
                Documentos individuais dos sócios (como para financiamento a
                particulares).
              </li>
            </ul>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:p-0 p-6 rounded-lg"
            encType="multipart/form-data"
          >
            <input
              type="text"
              {...register("honeypot")}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {[
              {
                name: "name",
                placeholder: "* O seu Nome",
                message: "O nome é obrigatório",
              },
              {
                name: "phone",
                placeholder: "* O seu Telefone",
                message: "O telefone é obrigatório",
              },
              {
                name: "email",
                placeholder: "* O seu Email",
                message: "O email é obrigatório",
              },
              {
                name: "carYear",
                placeholder: "* Ano da Viatura",
                message: "O ano da viatura é obrigatório",
              },
              {
                name: "amount",
                placeholder: "* Valor Pretendido",
                message: "O valor pretendido é obrigatório",
              },
              {
                name: "installments",
                placeholder: "* Nº Mensalidades",
                message: "O número de mensalidades é obrigatório",
              },
            ].map(({ name, placeholder, message }) => (
              <div key={name}>
                <input
                  {...register(name as keyof FormData, { required: message })}
                  placeholder={placeholder}
                  className="p-3 bg-zinc-300 rounded-md w-full"
                />
                {errors[name as keyof FormData]?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors[name as keyof FormData]?.message)}
                  </p>
                )}
              </div>
            ))}

            <div className="col-span-2">
              <textarea
                {...register("message")}
                placeholder="A sua Mensagem"
                className="p-3 bg-zinc-300 rounded-md w-full h-32"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm text-zinc-600 block mb-2">
                Anexe um arquivo PDF (opcional):
              </label>
              <input
                type="file"
                accept="application/pdf"
                {...register("file")}
                className="p-2 bg-zinc-300 rounded-md w-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  {...register("terms", {
                    required: "Você precisa aceitar os termos.",
                  })}
                  className="w-6 h-6"
                />
                <Link
                  href="/terms"
                  className="text-sm text-zinc-600 hover:text-blue-500 underline"
                >
                  Li e aceito os Termos e Condições.
                </Link>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm ml-8 col-span-2">
                  {errors.terms.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="col-span-2 bg-red-600 text-white py-3 rounded-md text-lg font-semibold transition-colors duration-300 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "ENVIAR"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default IntermediationPage;
