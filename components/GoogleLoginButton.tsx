import { VFC } from "react";
import Image from "next/image";

import styles from "styles/components/GoogleLoginButton.module.scss";

type Props = {
  handleClick: () => void;
};

const GoogleLoginButton: VFC<Props> = ({ handleClick }) => (
  <button onClick={handleClick} className={styles.outer}>
    <Image src="/google.png" alt="Google Login Button" width={18} height={18} />
    <p className={styles.text}>Sign in with Google</p>
  </button>
);

export default GoogleLoginButton;
