import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

// import { colors } from "react-select/dist/declarations/src/theme";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ToastContainer
        position="top-right"
        theme="light"
        toastClassName="text-[#324158]"
        progressStyle={{ backgroundColor: "#324158" }}
        limit={500}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
