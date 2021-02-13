import axios from "axios";

const instance = axios.create({
  baseURL: "https://iasq1mr2:8081/exsql?dbserver="
});

instance.interceptors.request.use(req => {
  console.log(req);
  return req;
});

//on successful response
instance.interceptors.response.use(
  response => {
    console.log("success", response);
    return response;
  },
  error => {
    console.log("error", error);
    return Promise.reject(error);
  }
);

export default instance;
