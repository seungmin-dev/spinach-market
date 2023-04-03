import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import { Stream } from "@prisma/client";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useInfiniteScroll } from "@libs/client/useInfiniteScroll";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
  pages: number;
}
const getKey = (pageIndex: number, previousPageData: StreamsResponse) => {
  if (pageIndex === 0) return `/api/streams?page=0`;
  if (pageIndex === previousPageData.pages) return null;
  if (pageIndex > 0) return `/api/streams?page=${pageIndex + 1}`;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Streams: NextPage = () => {
  const { data, setSize } = useSWRInfinite<StreamsResponse>(getKey, fetcher);
  const streams = data ? data.map((item) => item.streams).flat() : [];
  const page = useInfiniteScroll();
  useEffect(() => {
    setSize(page);
  }, [setSize, page]);

  return (
    <Layout title="라이브" hasTabBar seoTitle="라이브">
      <div className="divide-y-2 space-y-4">
        {streams.map((stream) => (
          <Link legacyBehavior key={stream.id} href={`/streams/${stream.id}`}>
            <a className="pt-4 block  px-4">
              <div className="w-full relative overflow-hidden rounded-md shadow-sm bg-slate-300 aspect-video">
                {/* <Image
                  fill
                  src={`https://videodelivery.net/${stream.cloudflareId}/thumbnails/thumbnail.jpg?height=320`}
                /> */}
              </div>
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </a>
          </Link>
        ))}
        <FloatingButton href="/streams/create">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Streams;
