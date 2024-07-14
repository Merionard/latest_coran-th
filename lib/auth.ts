import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession, Session } from "next-auth";

type ParametersGetServerSession =
  | []
  | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
  | [NextApiRequest, NextApiResponse];

let sessionCache: { [key: string]: Session | null } = {};
export const getAuthSession = async (
  ...parameters: ParametersGetServerSession
) => {
  const cacheKey = parameters.join(":");

  if (sessionCache[cacheKey]) {
    return sessionCache[cacheKey];
  }
  const session = await getServerSession(...parameters, authOptions);
  sessionCache[cacheKey] = session;
  setTimeout(() => {
    delete sessionCache[cacheKey];
  }, 300000); // Cache expires in 5 minutes
  return session;
};

export const getRequiredAuthSession = async (
  ...parameters: ParametersGetServerSession
) => {
  const session = await getServerSession(...parameters, authOptions);
  if (!session?.user.id) {
    throw new Error("User not Found");
  }
  return session as {
    user: { id: string; email?: string; name: string };
  };
};
