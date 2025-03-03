import { API_URL } from "@/lib/constants";
import { useSnackbar } from "@/lib/snackbarContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || !password) {
      showSnackbar("all fields are required", "error");
    } else if (!email.includes("@")) {
      showSnackbar("please enter a valid email", "error");
    } else if (password.length < 8) {
      showSnackbar("password must be at least 8 characters long", "error");
    } else {
      try {
        const res = await axios.post(API_URL + "/auth/login", {
          email,
          password,
        });
        if (res.status === 200) {
          console.log(res.data.message);
          showSnackbar(res.data.message, "success");
          router.push("/dashboard");
          return;
        }
      } catch (error: any) {
        console.log(error);
        if (error?.request?.status === 0) {
          showSnackbar(error.message, "error");
          return;
        }
        showSnackbar(
          error?.response?.data?.message || "An error occurred",
          "error"
        );
      }
    }
  }
  return {
    setEmail,
    setPassword,
    handleSubmit,
  };
}
