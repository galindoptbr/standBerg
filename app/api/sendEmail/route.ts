import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, phone, email, carYear, amount, installments, message } =
      await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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
    console.error("Erro ao enviar e-mail:", error); // Adiciona log do erro
    return NextResponse.json(
      { message: "Erro ao enviar email." },
      { status: 500 }
    );
  }
}