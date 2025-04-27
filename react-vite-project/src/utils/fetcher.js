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
  try {
    input = input.replace(/^\//, '');
    const url = BASE_URL + input;
    const response = await fetch(`${BASE_URL}${input}`, fetchOptions);
    return response;
  } catch(e) {
    throw e;
  }

}
export default fetcher;
