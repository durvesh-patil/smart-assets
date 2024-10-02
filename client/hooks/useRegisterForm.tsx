"use client";
import { API_URL } from "@/lib/constants";
import { useSnackbar } from "@/lib/snackbarContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useRegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Basic validation for demonstration
    if (!email || !password || !confirmPassword) {
      showSnackbar("All fields are required.", "error");
    } else if (!email.includes("@")) {
      showSnackbar("Please enter a valid email", "error");
    } else if (password !== confirmPassword) {
      showSnackbar("Passwords do not match.", "error");
    } else {
      // Simulate successful form submission
      try {
        const res = await axios.post(API_URL + "/auth/register", {
          email,
          password,
        });
        console.log(res);
        if (res.status === 201) {
          showSnackbar(res.data.message, "success");
          router.push("/login");
          return;
        }
      } catch (error: any) {
        console.log("error occured", error);
        if (error?.request?.status === 0) {
          showSnackbar(error.message, "error");
          return;
        }
        showSnackbar(
          error.response.data.message || "An error occurred",
          "error"
        );
      }
    }
  }

  return {
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  };
}
