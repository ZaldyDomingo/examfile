import AuthGuard from "../../../components/AuthGuard";
import CategoriesList from "../../../components/CategoriesList";

export default function CategoriesPage() {
  return (
    <AuthGuard>
      <CategoriesList />
    </AuthGuard>
  );
}
