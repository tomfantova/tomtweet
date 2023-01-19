import { api } from "../utils/api";
import { useState } from "react";
import { UserState } from "../reducers/user";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";
import Image from "next/image";
import styles from "../styles/signin.module.css";
import { useToasts } from "react-toast-notifications";

function SignIn() {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user.value);
  const { addToast } = useToasts();

  // Redirect to /home if logged in
  const router = useRouter();
  if (user.token) {
    router.push("/");
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signin = api.user.signin.useMutation({
    onSuccess: (user) => {
      if (user) {
        dispatch(
          login({
            token: user.token,
            username: user.username,
            firstName: user.firstName,
          })
        );
      } else {
        addToast("Missing fields or wrong id / password", {
          appearance: "error",
        });
      }
    },
  });

  const handleSubmit = () => {
    signin.mutate({ username, password });
  };

  return (
    <div className={styles.container}>
      <Image src="/logo.png" alt="Logo" width={50} height={50} />
      <h3 className={styles.title}>Connect to Hackatweet</h3>
      <input
        type="text"
        className={styles.input}
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        placeholder="Username"
      />
      <input
        type="password"
        className={styles.input}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
      />
      <button className={styles.button} onClick={() => handleSubmit()}>
        Sign in
      </button>
    </div>
  );
}

export default SignIn;
