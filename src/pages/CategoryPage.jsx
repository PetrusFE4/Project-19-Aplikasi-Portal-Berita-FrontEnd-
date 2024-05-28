import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [articles, setArticles] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true); // Set loading state true before fetching data
      try {
        const response = await axios.get(
          "https://apiberita.pandekakode.com/api/artikels"
        );

        const categoryArticles = response.data.data
          .filter((article) => article.categories.includes(categoryName))
          .sort((a, b) => new Date(b.published_at) - new Date(a.published_at)); // Sort articles by date

        setArticles(categoryArticles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category data:", error);
        setLoading(false);
      }
    };

    const fetchLatestNews = async () => {
      try {
        const response = await axios.get(
          "https://apiberita.pandekakode.com/api/artikels"
        );
        const sortedNews = response.data.data.sort(
          (a, b) => new Date(b.published_at) - new Date(a.published_at)
        );
        setLatestNews(sortedNews.slice(0, 10)); // Get the latest 5 news articles
      } catch (error) {
        console.error("Error fetching latest news:", error);
      }
    };

    fetchCategoryData();
    fetchLatestNews();
  }, [categoryName]);

  const formatDateIndonesian = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  return (
    <div className="mx-auto max-w-screen-lg p-4" style={{ marginTop: "130px" }}>
      <h1 className="text-2xl font-bold mb-8">
        Berita {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border text-primary" role="status">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-4">
            {articles.slice(0, 2).map((article) => (
              <div key={article.id} className="p-4">
                <img
                  src={article.image_url || "https://via.placeholder.com/150"}
                  alt={article.title}
                  className="w-full h-40 object-cover mb-4 rounded-lg shadow-2xl"
                />
                <p className="text-sm text-gray-600 mb-2">
                  {formatDateIndonesian(article.published_at)}
                </p>
                <h3 className="text-sm font-bold mt-2 line-clamp-4">
                  {article.title}
                </h3>
                <p className="text-sm mt-2">
                  {truncateDescription(article.description, 10)}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Read More
                </a>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 md:row-span-2 p-4">
            {articles[2] && (
              <>
                <img
                  src={
                    articles[2].image_url || "https://via.placeholder.com/150"
                  }
                  alt={articles[2].title}
                  className="w-full h-80 object-cover mb-4 rounded-lg shadow-2xl"
                />
                <p className="text-sm text-gray-600 mb-2">
                  {formatDateIndonesian(articles[2].published_at)}
                </p>
                <h2 className="text-lg font-bold mt-2">{articles[2].title}</h2>
                <p className="text-sm mt-2">
                  {truncateDescription(articles[2].description, 10)}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Read More
                </a>
              </>
            )}
          </div>

          <div className="md:col-span-1 space-y-4">
            {articles.slice(3, 5).map((article) => (
              <div key={article.id} className="p-4">
                <img
                  src={article.image_url || "https://via.placeholder.com/150"}
                  alt={article.title}
                  className="w-full h-40 object-cover mb-4 rounded-lg shadow-2xl"
                />
                <p className="text-sm text-gray-600 mb-2">
                  {formatDateIndonesian(article.published_at)}
                </p>
                <h3 className="text-sm font-bold mt-2 line-clamp-4">
                  {article.title}
                </h3>
                <p className="text-sm mt-2">
                  {truncateDescription(article.description, 10)}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Read More
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && <hr className="mt-8 border border-black" />}

      {!loading && (
        <div className="mt-1">
          <h2 className="text-2xl font-bold mb-8">Berita Terbaru</h2>
          <div className="grid grid-cols-1 gap-4">
            {latestNews.map((news, index) => (
              <div className="flex mb-4" key={index}>
                <img
                  src={news.image_url || "https://via.placeholder.com/150"}
                  alt={news.title}
                  className="w-48 object-cover flex-shrink-0 rounded-lg shadow-lg"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-sm font-bold mt-2">{news.title}</h3>
                  <span className="block text-xs text-gray-600 mt-1">
                    {formatDateIndonesian(news.published_at)}
                  </span>
                  <p className="mt-1 text-xs">
                    {news.description && news.description.length > 150
                      ? news.description.substring(0, 150) + "..."
                      : news.description}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
