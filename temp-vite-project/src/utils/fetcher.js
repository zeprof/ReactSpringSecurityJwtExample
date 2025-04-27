import mergeHeaders from "./mergeheader";
import BASE_URL from "../components/config/Config.jsx";
async function fetcher(input, options) {
  // your headers
  const defaultHeaders = { Authorization: localStorage.getItem("token") }
  // merge them with the headers of the options
  const headers = mergeHeaders(defaultHeaders, options?.headers);
  // merge the options with the headers
  const fetchOptions = { ...options, headers };
  // fetch
  return fetch(`${BASE_URL}${input}`, fetchOptions);
}
export default fetcher;
