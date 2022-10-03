import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  let router = useRouter();

  useEffect(() => {
    router.push("/auth/login");
  }, []);
}
