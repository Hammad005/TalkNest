import axios from "./axios";

export const signup = async (signupData) => {
  const res = await axios.post("/auth/signup", signupData);
  return res.data;
};
export const login = async (loginData) => {
  const res = await axios.post("/auth/login", loginData);
  return res.data;
};
export const logout = async () => {
  const res = await axios.post("/auth/logout");
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axios.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const res = await axios.post("/auth/onboarding", userData);
  return res.data;
};

export const getUserFriends = async () => {
  const res = await axios.get("/users/friends");
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axios.get("/users");
  return res.data;
};

export const getOutgoingFriendReqs = async () => {
  const res = await axios.get("/users/outgoing-friend-requests");
  return res.data?.outgoingRequest;
};

export const sendFriendRequest = async (userId) => {
  const res = await axios.post(`/users/friend-request/${userId}`);
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axios.get("/users/friend-requests");
  return res.data;
};

export const acceptFriendRequest = async (requestId) => {
  const res = await axios.put(`/users/friend-request/${requestId}/accept`);
  return res.data;
};

export const getStreamToken = async () => {
  const res = await axios.get("/chat/token");
  return res.data;
}