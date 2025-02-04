import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const SECRET_KEY = process.env.GOOGLE_RECAPTCHA_SECRET_KEY || "";

export async function POST(req: Request) {
  try {
    const {
      name,
      phone,
      email,
      carYear,
      amount,
      installments,
      message,
      recaptchaToken,
    } = await req.json();

    // Verifica se o reCAPTCHA Token foi enviado
    if (!recaptchaToken) {
      return NextResponse.json(
        { message: "Token reCAPTCHA ausente." },
        { status: 400 }
      );
    }

    // Validação do reCAPTCHA com o Google
    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: SECRET_KEY,
          response: recaptchaToken,
        }),
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    // Verifica se a resposta do reCAPTCHA foi bem-sucedida
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json(
        { message: "Verificação reCAPTCHA falhou." },
        { status: 403 }
      );
    }

    // Configuração do transporte do Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Envio do e-mail após a validação bem-sucedida do reCAPTCHA
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "galindoleitept@gmail.com",
      subject: "Novo Pedido de Financiamento",
      text: `
        Nome: ${name}
        Telefone: ${phone}
        Email: ${email}
        Ano da Viatura: ${carYear}
        Valor Pretendido: ${amount}
        Nº Mensalidades: ${installments}
        Mensagem: ${message || "Nenhuma mensagem adicional"}
      `,
    });

    return NextResponse.json(
      { message: "Email enviado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return NextResponse.json(
      { message: "Erro ao enviar email." },
      { status: 500 }
    );
  }
}
