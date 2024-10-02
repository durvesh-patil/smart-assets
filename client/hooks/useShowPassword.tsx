import { useState } from "react";

export default function useShowPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return {
    setShowPassword,
    setShowConfirmPassword,
    showPassword,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
    togglePasswordVisibility,
  };
}
