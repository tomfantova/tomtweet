import { useSelector } from "react-redux";
import { TweetsState } from "../reducers/tweets";
import Tweet from "../components/Tweet";
import styles from "../styles/LastTweets.module.css";

function LastTweets() {
  const tweetsData = useSelector(
    (state: { tweets: TweetsState }) => state.tweets.value
  );

  const tweets = tweetsData.map((data, i) => {
    return <Tweet key={i} {...data} />;
  });

  return <>{tweets}</>;
}

export default LastTweets;
