import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";

interface StreamMessage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}
interface StreamWithMessages extends Stream {
  messages: StreamMessage[];
}
interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessages;
}

interface MessageForm {
  message: string;
}

const StreamDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              { id: Date.now(), message: form.message, user: { ...user } },
            ],
          },
        } as any)
    );
    // sendMessage(form);
  };
  return (
    <Layout canGoBack seoTitle={`${data?.stream.name} 방송`}>
      <div className="py-10 px-4  space-y-4">
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video">
          {data?.stream.cloudflareId ? (
            <iframe
              src={`https://iframe.videodelivery.net/${data?.stream.cloudflareId}`}
              className="w-full aspect-video rounded-md"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          ) : null}
        </div>
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            $ {data?.stream.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream.description}</p>
          <div className="bg-orange-300 flex flex-col space-y-1 text-sm p-4 rounded-sm overflow-y-scroll">
            <span>Stream Keys (secret)</span>
            <span className="text-gray-600">
              <span className=" text-gray-800">URL : </span>
              {data?.stream.cloudflareUrl}
            </span>
            <span className="text-gray-600">
              <span className=" text-gray-800">Key : </span>
              {data?.stream.cloudflareKey}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream.messages.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={message.user.id === user?.id}
              />
            ))}
          </div>
          <form
            onSubmit={handleSubmit(onValid)}
            className="fixed py-2 bg-white  bottom-0 inset-x-0"
          >
            <div className="flex relative max-w-md items-center  w-full mx-auto">
              <input
                {...register("message", { required: true })}
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StreamDetail;
