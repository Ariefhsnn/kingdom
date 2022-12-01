import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import axios from "axios";

function MyApp({ Component, pageProps }) {
  // console.log(process.env.REACT_APP_API_ENDPOINT, "endpoint");
  axios.defaults.baseURL = "https://kingdom-api-dev.gbempower.asia/";

  return (
    <>
      <NextNProgress
        color="#324158"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <ToastContainer
        position="top-right"
        theme="light"
        // progressStyle={{ backgroundColor: "#324158" }}
        limit={3}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
