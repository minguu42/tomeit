import { useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import TopAppBar from "components/common/TopAppBar";
import CatchMessage from "components/landing/CatchMessage";
import GoogleLoginButton from "components/landing/GoogleLoginButton";
import s from "./styles.module.scss";
import { useAuth } from "contexts/AuthContext";

const Landing = (): JSX.Element => (
  <>
    <Head>
      <title>tomeit</title>
      <meta
        name="description"
        content="tomeit は必要なことだけに集中するためのタスク管理アプリです。ポモドーロテクニックを使って、今やるべきことのみに集中し, 淡々とタスクをこなしましょう！"
      />
    </Head>

    <TopAppBar />
    <main className={s.main}>
      <div className={s.leftWrapper}>
        <CatchMessage />
        <GoogleLoginButton />
      </div>
      <div>
        <Image
          src="/work_from_home.png"
          alt="work image"
          width={480}
          height={340}
        />
      </div>
    </main>
  </>
);

const LandingContainer: NextPage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser !== null) {
      router
        .push("/tasks/today")
        .catch(() => window.alert("エラーが発生しました。"));
    }
  }, [router, currentUser]);

  return <Landing />;
};

export default LandingContainer;
