import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as formidable from "formidable";
import fs from "fs/promises";
import { IncomingMessage } from "http";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false, // ✅ Importante para processar arquivos corretamente
  },
};

// ✅ Converte a Request do Next.js para um formato que o formidable possa entender
async function convertRequestToStream(req: Request): Promise<IncomingMessage> {
  const body = await req.arrayBuffer();
  const readableStream = Readable.from(Buffer.from(body));

  // ✅ Converte os headers do Next.js para um formato compatível com IncomingMessage
  const incomingMessage = Object.assign(readableStream, {
    headers: Object.fromEntries(req.headers.entries()), // ✅ Converte diretamente os headers
    method: req.method,
    url: req.url,
  });

  return incomingMessage as IncomingMessage;
}

// ✅ Função para processar FormData corretamente no App Router
async function getFormData(
  req: Request
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable.default({ multiples: false });

  // ✅ Converte a Request para um stream compatível com formidable
  const incomingMessage = await convertRequestToStream(req);

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(
        incomingMessage,
        (
          err: Error | null,
          fields: formidable.Fields,
          files: formidable.Files
        ) => {
          if (err) reject(err);
          else resolve({ fields, files });
        }
      );
    }
  );
}

export async function POST(req: Request) {
  try {
    const { fields, files } = await getFormData(req);

    const {
      name,
      phone,
      email,
      carYear,
      amount,
      installments,
      message,
      honeypot,
    } = fields;

    // 🚨 Proteção contra bots (Honeypot)
    if (honeypot) {
      return NextResponse.json(
        { error: "Ação bloqueada por suspeita de bot." },
        { status: 400 }
      );
    }

    // Configuração do Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // ✅ Agora usando a Senha de Aplicativo do Google!
      },
    });

    // Configuração do email
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: "galindoleitept@gmail.com", // Altere para o email do stand // Ele deve ir em Google conta > Senhas de app e gerar uma senha de app
      subject: `Solicitação de Financiamento de ${name}`,
      text: `Nome: ${name}\nTelefone: ${phone}\nEmail: ${email}\nAno do Carro: ${carYear}\nValor Pretendido: ${amount}\nMensalidades: ${installments}\nMensagem: ${
        message || "Nenhuma mensagem enviada"
      }`,
    };

    // 📂 Se houver um arquivo PDF, anexe ao e-mail
    if (files.file) {
      const uploadedFile = Array.isArray(files.file)
        ? files.file[0]
        : files.file;

      if (uploadedFile) {
        const fileBuffer = await fs.readFile(uploadedFile.filepath);
        mailOptions.attachments = [
          {
            filename: uploadedFile.originalFilename || "anexo.pdf",
            content: fileBuffer,
          },
        ];
      }
    }

    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Formulário enviado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return NextResponse.json(
      { error: "Erro ao enviar o e-mail." },
      { status: 500 }
    );
  }
}
