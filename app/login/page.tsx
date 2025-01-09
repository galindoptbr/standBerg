"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app } from "../src/services/firebase";
import { setCookie } from "nookies";
import { FcGoogle } from "react-icons/fc";

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    // Captura o parâmetro de erro na URL
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam === "unauthorized") {
      setError("Você não tem permissão para acessar esta página.");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  /* const handleGoogleLogin = async () => {
    setError("");
    try {
      // Configura o provedor para forçar a seleção de conta
      provider.setCustomParameters({
        prompt: "select_account", // Força o pop-up a exibir a seleção de conta
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        setError("Não foi possível obter seu e-mail. Tente novamente.");
        await signOut(auth);
        return;
      }

      // Lista de e-mails autorizados
      const adminEmails = ["galindoleitept@gmail.com", "feliciosantoslive@gmail.com"];

      if (!adminEmails.includes(user.email)) {
        setError(
          "Acesso negado. Você não está autorizado a acessar este sistema."
        );
        await signOut(auth); // Faz logout
        return;
      }

      const token = await user.getIdToken();
      setCookie(null, "authToken", token, {
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/", // Disponível em todo o site
      });

      router.push("/admin");
    } catch (err) {
      setError("Falha ao fazer login com Google. Tente novamente.");
      console.error(err);
    }
  }; */

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
  
      provider.setCustomParameters({
        prompt: "select_account", // Força o pop-up a exibir a seleção de conta
      });
  
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (!user.email) {
        alert("Não foi possível obter seu e-mail. Tente novamente.");
        await signOut(auth);
        return;
      }
  
      const token = await user.getIdToken();
      setCookie(null, "authToken", token, {
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/", // Disponível em todo o site
      });
  
      router.push("/admin");
    } catch (err) {
      console.error("Falha ao fazer login com Google:", err);
      alert("Erro ao fazer login. Tente novamente.");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-zinc-100 text-zinc-700 py-2 rounded hover:bg-zinc-200 flex items-center justify-center gap-x-2"
        >
          <FcGoogle size={30} />
          Entrar com Google
        </button>
      </div>
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-sm w-full text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
