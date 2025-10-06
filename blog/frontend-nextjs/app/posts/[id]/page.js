import AuthGuard from "../../../components/AuthGuard";
import PostDetail from "../../../components/PostDetail";

export default function PostDetailPage() {
  return (
    <AuthGuard>
      <PostDetail />
    </AuthGuard>
  );
}
