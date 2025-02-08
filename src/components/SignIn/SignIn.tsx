"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SignIn.module.css";

interface SignInFormData {
  identifier: string;
  password: string;
}

const SignIn = () => {
  const [formData, setFormData] = useState<SignInFormData>({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<Partial<SignInFormData>>({});

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof SignInFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const newErrors: Partial<SignInFormData> = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Username or Email is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome Back!</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <input
          name="identifier"
          type="text"
          placeholder="Username or Email"
          className={styles.inputField}
          value={formData.identifier}
          onChange={handleInputChange}
        />
        {errors.identifier && (
          <span className={styles.errorMessage}>{errors.identifier}</span>
        )}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className={styles.inputField}
          value={formData.password}
          onChange={handleInputChange}
        />
        {errors.password && (
          <span className={styles.errorMessage}>{errors.password}</span>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className={styles.switchAuth}>
        Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
