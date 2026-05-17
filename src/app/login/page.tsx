import type { Metadata } from "next";
import LoginPage from "@/views/login-page";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your Thara Infra account.",
};

export default function Page() {
  return <LoginPage />;
}
