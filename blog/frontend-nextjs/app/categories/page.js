"use client";
import AuthGuard from "../../components/AuthGuard";
import CategoriesList from "../../components/CategoriesList";

export default function CategoriesPage() {
  return (
    <AuthGuard>
      <CategoriesList />
    </AuthGuard>
  );
}
import { useState, useEffect } from "react";
import { apiService } from "../../lib/api";
import { useRouter } from "next/navigation";
