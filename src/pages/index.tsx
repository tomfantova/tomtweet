import styles from "../styles/index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "../reducers/user";
import { logout } from "../reducers/user";
import { loadTweets, addTweet } from "../reducers/tweets";
import Link from "next/link";
import Image from "next/image";
import LastTweets from "../components/LastTweets";
import Trends from "../components/Trends";

const Home: NextPage = () => {
  const dispatch = useDispatch();

  // Redirect to /login if not logged in
  const router = useRouter();
  useEffect(() => {
    if (!user.token) {
      router.push("/login");
    }
  }, []);

  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [newTweet, setNewTweet] = useState("");

  useEffect(() => {
    if (!user.token) {
      return;
    }

    fetch(`http://localhost:3000/tweets/all/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        data.result && dispatch(loadTweets(data.tweets));
      });
  }, []);

  const handleInputChange = (e) => {
    if (
      newTweet.length < 280 ||
      e.nativeEvent.inputType === "deleteContentBackward"
    ) {
      setNewTweet(e.target.value);
    }
  };

  // Ajout tweet provisoir, à remplacer par code en dessous avec BDD //

  const handleSubmit = () => {
    const createdTweet = {
      author: { firstName: user.firstName, username: user.username },
      content: newTweet,
      createdAt: new Date(),
      likes: [],
    };
    dispatch(addTweet(createdTweet));
  };

  // const handleSubmit = () => {
  //   fetch("http://localhost:3000/tweets", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ token: user.token, content: newTweet }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.result) {
  //         const createdTweet = { ...data.tweet, author: user };
  //         dispatch(addTweet(createdTweet));
  //         setNewTweet("");
  //       }
  //     });
  // };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className={styles.logo}
            />
          </Link>
        </div>
        <div>
          <div className={styles.userSection}>
            <div>
              <Image
                src="/avatar.png"
                alt="Avatar"
                width={46}
                height={46}
                className={styles.avatar}
              />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.name}>{user.firstName}</p>
              <p className={styles.username}>@{user.username}</p>
            </div>
          </div>
          <button
            onClick={() => {
              router.push("/login");
              dispatch(logout());
            }}
            className={styles.logout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={styles.middleSection}>
        <h2 className={styles.title}>Home</h2>
        <div className={styles.createSection}>
          <textarea
            placeholder="What's up?"
            className={styles.input}
            onChange={(e) => handleInputChange(e)}
            value={newTweet}
          />
          <div className={styles.validateTweet}>
            <p>{newTweet.length}/280</p>
            <button className={styles.button} onClick={() => handleSubmit()}>
              Tweet
            </button>
          </div>
        </div>
        <LastTweets />
      </div>

      <div className={styles.rightSection}>
        <h2 className={styles.title}>Trends</h2>
        <Trends />
      </div>
    </div>
  );
};

export default Home;
