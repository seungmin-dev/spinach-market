import useUser from "@libs/client/useUser";
import type { NextPage } from "next";
import Head from "next/head";
import FloatingButton from "../components/floating-button";
import Item from "../components/item";
import Layout from "../components/layout";
import useSWR, { SWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import { Product } from "@prisma/client";
import client from "@libs/server/client";
import { useEffect } from "react";
import { useInfiniteScroll } from "@libs/client/useInfiniteScroll";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}
interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
  pages: number;
}

const getKey = (pageIndex: number, previousPageData: ProductsResponse) => {
  if (pageIndex === 0) return `/api/products?page=0`;
  if (pageIndex === previousPageData.pages) return null;
  if (pageIndex > 0) return `/api/products?page=${pageIndex + 1}`;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data, setSize } = useSWRInfinite<ProductsResponse>(getKey, fetcher);
  const products = data ? data.map((item) => item.products).flat() : [];
  const page = useInfiniteScroll();
  useEffect(() => {
    setSize(page);
  }, [setSize, page]);
  return (
    <Layout title="홈" hasTabBar seoTitle="홈">
      <Head>
        <title>HOME</title>
      </Head>
      <div className="flex flex-col space-y-5  divide-y">
        {products?.map((product) => (
          <Item
            id={product?.id}
            key={product?.id}
            title={product?.name}
            price={product?.price}
            comments={1}
            hearts={product?._count?.favs || 0}
          />
        ))}
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

const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const products = await client.product.findMany({});
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default Page;
