import useUser from "@libs/client/useUser";
import type { NextPage } from "next";
import Head from "next/head";
import FloatingButton from "../components/floating-button";
import Item from "../components/item";
import Layout from "../components/layout";
import useSWR from "swr";
import { Product } from "@prisma/client";

interface FavsCount extends ProductsResponse {
  _count: number;
}
interface ProductsResponse {
  ok: boolean;
  products: Product[];
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ProductsResponse>("/api/products");

  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>HOME</title>
      </Head>
      <div className="flex flex-col space-y-5 py-10 divide-y">
        {data?.products?.map(
          (
            product //ts가 product를 인식하지 못해서 오류, Interface 생성
          ) => (
            <Item
              id={product.id}
              key={product.id}
              title={product.name}
              price={product.price}
              comments={1}
              hearts={product._count.favs}
            />
          )
        )}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
