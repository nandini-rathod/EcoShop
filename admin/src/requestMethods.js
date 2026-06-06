import axios from "axios";

const BASE_URL = "http://localhost:5001/api/";
// const TOKEN =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     .accessToken || "";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken;
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTgwZmMyYmI2Zjg5ZTMwNmEwZTMzOCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4ODc0MjEyMywiZXhwIjoxNjg5MDAxMzIzfQ.D72z3eQC48nE616o4xBi9aW-F9e_r9lLphhEgCDEAo0"

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});