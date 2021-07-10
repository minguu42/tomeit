import { VFC } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "styles/components/Header.module.scss";
import SummarizeIcon from "components/icons/SummarizeIcon";
import AccountMenu from "components/AccountMenu";
import { useAuth } from "lib/AuthContext";

type Props = {
  isLoggedIn: boolean;
};

const Header: VFC<Props> = ({ isLoggedIn }) => (
  <header className={styles.outer}>
    <div className={styles.inner}>
      <Link href="/">
        <a className={styles.leftWrapper}>
          <Image src="/logo512.png" alt="tomeit Logo" width={32} height={32} />
          <h2 className={styles.appName}>tomeit</h2>
        </a>
      </Link>
      {isLoggedIn && (
        <div className={styles.rightWrapper}>
          <SummarizeIcon fill="#ffffff" />
          <AccountMenu />
        </div>
      )}
    </div>
  </header>
);

const HeaderContainer: VFC = () => {
  const { currentUser } = useAuth();

  return <Header isLoggedIn={currentUser !== null} />;
};

export default HeaderContainer;
