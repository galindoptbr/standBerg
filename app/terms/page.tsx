"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TermsPage: React.FC = () => {
  const pathname = usePathname();

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
                  ? "text-zinc-400"
                  : "text-zinc-400 hover:text-red-500"
              }`}
            >
              Início /
            </Link>
          </li>
          <li>
            <Link
              href="/terms"
              className={`transition-colors duration-300 ${
                pathname === "/terms"
                  ? "text-yellow-500"
                  : "text-zinc-400 hover:text-red-500"
              }`}
            >
              Termos e Condições
            </Link>
          </li>
        </ul>
      </div>

      <div className="max-w-[1200px] mx-auto mt-12 mb-36 p-4 lg:p-0">
        <div className="flex flex-col text-center">
          <h1 className="text-3xl font-semibold text-red-600">
            Termos e Condições
          </h1>
          <p className="text-zinc-600 max-w-[956px] mx-auto mt-2 p-2 lg:p-0">
            Leia atentamente os termos e condições antes de utilizar nosso
            website.
          </p>
        </div>

        <div className="bg-gray-100 p-6 mt-6 rounded-lg text-zinc-700 space-y-6">
          <h2 className="text-2xl font-semibold text-red-600">
            Dados da Empresa
          </h2>
          <p>
            A <strong>[Nome da Empresa]</strong> é uma empresa portuguesa, com
            sede na morada <strong>[Endereço Completo]</strong>e registada sob o
            número único <strong>[NIF da Empresa]</strong>.
          </p>

          <h2 className="text-xl font-semibold text-red-600">
            Condições de Utilização
          </h2>
          <p>
            Estas condições regulam a utilização do website da{" "}
            <strong>[Nome da Empresa]</strong>, incluindo todos os seus
            conteúdos e serviços disponíveis. O Utilizador reconhece e aceita
            que o uso do website é feito sob sua exclusiva responsabilidade.
          </p>

          <p>
            A <strong>[Nome da Empresa]</strong> reserva-se o direito de alterar
            unilateralmente, a qualquer momento e sem aviso prévio, a estrutura
            e o design do website, modificar ou remover serviços e conteúdos,
            assim como os termos de acesso e/ou utilização do mesmo.
          </p>

          <h2 className="text-xl font-semibold text-red-600">
            Propriedade Intelectual e Industrial
          </h2>
          <p>
            Todos os textos, imagens, vídeos, animações e outros conteúdos
            disponíveis neste website são propriedade exclusiva da{" "}
            <strong>[Nome da Empresa]</strong> ou de terceiros devidamente
            autorizados.
          </p>
          <p>
            Os logotipos, marcas ou desenhos industriais exibidos no website
            estão protegidos por direitos de propriedade intelectual e
            industrial. Qualquer exploração, reprodução, distribuição ou
            transformação sem autorização expressa da{" "}
            <strong>[Nome da Empresa]</strong> é proibida.
          </p>

          <h2 className="text-xl font-semibold text-red-600">
            Produtos e Preços
          </h2>
          <p>
            A <strong>[Nome da Empresa]</strong> envida esforços para manter as
            informações do website atualizadas e precisas, mas estas devem ser
            consideradas como meramente indicativas. As especificações técnicas,
            imagens e equipamentos dos modelos podem ser alterados sem aviso
            prévio.
          </p>
          <p>
            Para obter informações detalhadas sobre modelos, características
            técnicas e preços, recomenda-se o contacto direto com a{" "}
            <strong>[Nome da Empresa]</strong>.
          </p>

          <h2 className="text-xl font-semibold text-red-600">
            Exclusão de Responsabilidade e Garantias
          </h2>
          <p>
            A <strong>[Nome da Empresa]</strong> não se responsabiliza por
            falhas no servidor, redes de comunicação ou problemas resultantes do
            uso de navegadores desatualizados.
          </p>
          <p>
            A responsabilidade pelo acesso ao website e pelo uso das informações
            nele contidas cabe exclusivamente ao Utilizador.
          </p>

          <h2 className="text-xl font-semibold text-red-600">
            Ligações para Outros Websites
          </h2>
          <p>
            Este website pode conter links para sites de terceiros, que possuem
            políticas de privacidade próprias. A{" "}
            <strong>[Nome da Empresa]</strong> não se responsabiliza pelo
            conteúdo ou práticas desses websites externos.
          </p>

          <h2 className="text-xl font-semibold text-red-600">
            Política de Dados Pessoais
          </h2>
          <p>
            Ao fornecer informações pessoais nos formulários do website, o
            Utilizador autoriza expressamente a{" "}
            <strong>[Nome da Empresa]</strong> a processá-las para os fins
            especificados.
          </p>

          <h2 className="text-xl font-semibold text-red-600">
            Cookies e Segurança
          </h2>
          <p>
            Este website utiliza cookies para otimizar a experiência do
            Utilizador. O uso de cookies pode ser gerenciado através das
            configurações do navegador.
          </p>

          <h2 className="text-xl font-semibold text-red-600">
            Legislação Aplicável e Jurisdição
          </h2>
          <p>
            Quaisquer litígios resultantes da interpretação ou execução destas
            Condições serão regulados pela legislação portuguesa, sendo
            competentes os Tribunais Judiciais da comarca onde se encontra a
            sede da empresa.
          </p>

          <h2 className="text-xl font-semibold text-red-600">
            Informação ao Consumidor
          </h2>
          <p>
            Nos termos do artigo 18º da Lei n.º 144/2015, de 8 de setembro, em
            caso de litígio, o consumidor pode recorrer ao
            <strong> Centro de Arbitragem do Setor Automóvel </strong>(
            <a
              href="https://www.arbitragemauto.pt"
              target="_blank"
              className="text-red-600 underline"
            >
              www.arbitragemauto.pt
            </a>
            ).
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
