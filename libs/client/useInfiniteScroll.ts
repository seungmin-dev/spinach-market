import { useEffect, useState } from "react";

export function useInfiniteScroll() {
  const [page, setPage] = useState(1);
  const [scrolltop, setScrolltop] = useState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleScroll() {
    if (
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.scrollHeight
    ) {
      setPage((p) => p + 1);
    }
    if (
      // 스크롤 올라갈 때
      page > 0 &&
      document.documentElement.scrollTop + window.innerHeight <
        document.documentElement.clientHeight * page
    ) {
      setPage((p) => p - 1);
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, page]);
  return page;
}
