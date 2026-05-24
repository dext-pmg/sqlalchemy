import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { api_url } from "../config.json";
import { toast } from "react-hot-toast";

function Home() {
  const { access_token, current_user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!access_token) {
      setLoading(false);
      return;
    }

    fetch(`${api_url}/posts`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data || []);
      })
      .catch(() => toast.error("Failed to load posts"))
      .finally(() => setLoading(false));
  }, [access_token]);

  const handleDelete = (id) => {
    if (!access_token) return toast.error("Not authenticated");

    fetch(`${api_url}/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts((p) => p.filter((x) => x.id !== id));
          toast.success("Post deleted");
        } else {
          toast.error(data.error || "Could not delete post");
        }
      })
      .catch(() => toast.error("Network error"));
  };

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-950">Home</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Welcome to the blog app. Posts from your Flask API can be listed here.
      </p>

      {!access_token && (
        <p className="mt-4 text-sm text-slate-600">Please log in to see posts.</p>
      )}

      {loading && <p className="mt-4">Loading...</p>}

      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-md border border-slate-200 bg-white p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-slate-700">{post.content}</p>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <div>
                By {post.user ? post.user.username : "Unknown"}
              </div>
              <div className="flex gap-2">
                {current_user && post.user && current_user.id === post.user.id && (
                  <>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Home;
