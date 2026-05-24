import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { api_url } from "../config.json";

function AddPost() {
  const { access_token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!access_token) {
      toast.error("You must be logged in to create a post");
      return;
    }

    fetch(`${api_url}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Post created");
          nav("/");
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error("Unexpected response from server");
        }
      })
      .catch(() => toast.error("Network error"));
  };

  return (
    <section className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-950">Add Post</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            placeholder="Post title"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            placeholder="Write your post"
            required
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Create post
        </button>
      </form>
    </section>
  );
}

export default AddPost;
