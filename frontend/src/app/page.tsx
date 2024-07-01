"use client";
import authService from "@/services/auth/auth.service";
import { use, useEffect, useState } from "react";


export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const getToken = async () => {
    let res = await authService.login('Sens2','admin')
    setToken(res.data.token)
  }

  useEffect(() => {
    getToken();
  }, []);
  return (
    <div>
      <h1>Home</h1>
      <h1>{token}</h1>
    </div>
  );
}
