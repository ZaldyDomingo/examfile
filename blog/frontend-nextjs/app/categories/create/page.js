import AuthGuard from "../../../components/AuthGuard";
import CategoryForm from "../../../components/CategoryForm";

export default function CreateCategory() {
  return (
    <AuthGuard>
      <CategoryForm />
    </AuthGuard>
  );
}
