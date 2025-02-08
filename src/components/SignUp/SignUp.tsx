"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SignUp.module.css";

interface SignUpFormData {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof SignUpFormData]) {
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

    const newErrors: Partial<SignUpFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/sign-up", {
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

      router.push("/signin");
    } catch (error) {
      console.error("Sign up failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Account</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.nameGroup}>
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            className={styles.inputField}
            onChange={handleInputChange}
            value={formData.firstName}
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            className={styles.inputField}
            onChange={handleInputChange}
            value={formData.lastName}
          />
        </div>
        {errors.firstName && (
          <span className={styles.errorMessage}>{errors.firstName}</span>
        )}

        <input
          name="username"
          type="text"
          placeholder="Username"
          className={styles.inputField}
          onChange={handleInputChange}
          value={formData.username}
        />
        {errors.username && (
          <span className={styles.errorMessage}>{errors.username}</span>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className={styles.inputField}
          onChange={handleInputChange}
          value={formData.email}
        />
        {errors.email && (
          <span className={styles.errorMessage}>{errors.email}</span>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          className={styles.inputField}
          onChange={handleInputChange}
          value={formData.password}
        />
        {errors.password && (
          <span className={styles.errorMessage}>{errors.password}</span>
        )}

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className={styles.inputField}
          onChange={handleInputChange}
          value={formData.confirmPassword}
        />
        {errors.confirmPassword && (
          <span className={styles.errorMessage}>{errors.confirmPassword}</span>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className={styles.switchAuth}>
        Already have an account? <Link href="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
