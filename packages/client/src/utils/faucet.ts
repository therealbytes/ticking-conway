import axios from "axios";

export function drip(faucetUrl: string, address: string): ReturnType<typeof axios.post> {
  return axios.post(faucetUrl, { address }).catch((error) => {
    console.warn(error.message);
  });
}
