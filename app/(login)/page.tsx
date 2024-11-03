import { Metadata } from "next";
import { AuthContainer } from "@/components/layout/AuthContainer";

export default function IndexPage() {
  return (
      <AuthContainer />
  );
}
export const metadata: Metadata = {
  title: "SIMS PPOB | IKRAM TAUFFIQUL HAKIM",
};