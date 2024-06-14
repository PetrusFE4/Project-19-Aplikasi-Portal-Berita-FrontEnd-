import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { IoShareSocial } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa6";

const NewsPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://apiberita.pandekakode.com/api/artikels/${id}`
        );
        setNews(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the news:", error);
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://apiberita.pandekakode.com/api/comments/${id}`
        );
        setComments(response.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const fetchLatestNews = async () => {
      try {
        const response = await axios.get(
          "https://apiberita.pandekakode.com/api/artikels"
        );
        setLatestNews(response.data.data);
      } catch (error) {
        console.error("Error fetching latest news:", error);
      }
    };

    fetchNews();
    fetchComments();
    fetchLatestNews();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentContent.trim() === "") {
      alert("Komentar tidak boleh kosong!");
      return;
    }

    try {
      const response = await axios.post(
        `https://apiberita.pandekakode.com/api/comments`,
        {
          article_id: id,
          content: commentContent,
        }
      );
      setComments([...comments, response.data.data]);
      setCommentContent("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const formatDateIndonesian = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!news) {
    return <div>News not found.</div>;
  }

  return (
    <div className="mx-auto max-w-screen-lg p-4 light theme-light mt-20 md:mt-36">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-4">
          <div className="mt-1 mb-2 flex items-center">
            {/* BREADCRUMB */}
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium text-black hover:text-gray-600"
                    onClick={() => (window.location.href = "/")}
                  >
                    <svg
                      className="w-3 h-3 me-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                      {news.categories}
                    </span>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg
                      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                      News
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            {/* BREADCRUMB */}
          </div>
          <h2 className="text-2xl font-bold mt-1 mb-2">{news.title}</h2>
          <div className="flex gap-2 mt-3 mb-3">
            <IoShareSocial className="text-lg text-gray-500 cursor-pointer hover:text-black" />
            <FaBookmark className="text-lg text-gray-500 cursor-pointer hover:text-black" />
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-lg w-full">
            <img
              src={news.image_url}
              alt="Cover"
              className="w-full h-96 md:w-full object-cover rounded-lg  transition-transform duration-700 ease-in-out transform hover:scale-110 cursor-pointer"
              style={{ aspectRatio: "16/10" }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {formatDateIndonesian(news.published_at)}
          </p>
          <hr className="my-4 border-t border-gray-300" />
          <h3 className="text-sm font-bold mt-1 mb-2">{news.title}</h3>
          <div className="text-justify">{news.content}</div>
          <hr className="my-4 border-t border-gray-300" />
          <div>
            <h3 className="text-lg font-semibold">Komentar</h3>
            <ul className="mt-4">
              {comments.map((comment) => (
                <li key={comment.id} className="mb-2">
                  {comment.content}
                </li>
              ))}
            </ul>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                className="w-full p-2 border rounded mt-4"
                rows="4"
                placeholder="Tulis komentar anda..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="mt-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="md:col-span-1">
          {/* Konten samping */}
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Iklan</h3>
            <p>Mie Sedap</p>
          </div>
        </div>
      </div>

      {/* Daftar Berita Lainnya */}
      <div className="mt-1">
        <h2 className="text-2xl font-bold mb-8">Berita Lainnya</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {latestNews.slice(3, 7).map((newsItem, index) => (
            <div key={index}>
              <div className="relative overflow-hidden rounded-lg shadow-lg w-full">
                <img
                  src={newsItem.image_url}
                  alt={newsItem.title}
                  className="w-full md:w-11/12 h-40 object-cover transition-transform duration-700 ease-in-out transform hover:scale-110 cursor-pointer"
                />
              </div>
              <span className="block text-xs text-gray-600 mt-1">
                {formatDateIndonesian(newsItem.published_at)}
              </span>
              <div className="mt-2">
                <Link to={`/news/${newsItem.id}`}>
                  <h3 className="text-base font-bold mt-2 line-clamp-2 hover:text-gray-500">
                    {newsItem.title}
                  </h3>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;