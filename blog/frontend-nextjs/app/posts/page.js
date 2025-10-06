import AuthGuard from "../../components/AuthGuard";
import PostsList from "../../components/PostsList";

export default function PostsPage() {
  return (
    <AuthGuard>
      <PostsList />
    </AuthGuard>
  );
}
