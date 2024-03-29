import Layout from "@components/layout";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface Post {
  title: String;
  date: String;
  category: String;
  slug: String;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="Blog" seoTitle="Blog">
      <h1 className="font-semibold text-lg">Latest Posts : </h1>
      <ul>
        {posts.map((post, index) => (
          <div key={index} className="mb-5">
            <Link href={`/blog/${post.slug}`}>
              <h4 className="text-lg font-bold text-teal-700 text-center mt-5">
                {post.title}
              </h4>
              <div className="text-right">
                <span className="text-sm italic text-gray-600">
                  {post.date} / {post.category}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </ul>
    </Layout>
  );
};

export async function getStaticProps() {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug };
  });
  return {
    props: { posts: blogPosts },
  };
}

export default Blog;
