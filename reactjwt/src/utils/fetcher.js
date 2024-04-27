import mergeHeaders from "./mergeheader";

async function fetcher(input, options) {
  // your headers
  const defaultHeaders = { Authorization: localStorage.getItem('token') }
  // merge them with the headers of the options
  const headers = mergeHeaders(defaultHeaders, options.headers)
  // add the headers to the options
  try {
    let response = await fetch(input, {...options, headers});
    return response;
  } catch(e) {
    throw e;
  }
}
export default fetcher;