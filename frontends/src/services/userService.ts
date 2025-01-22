import axiosInstance from "./axiosInstance";


export async function CurrentUserLevel() {
  try {
    const currentUser = await axiosInstance.get('/users/me');
    if (currentUser.status === 200) {
      const levelResponse = await axiosInstance.get(`/levels/${currentUser.data.level_id}`);
      if (levelResponse.status === 200) {
        return levelResponse.data.name;
      }
    }
  } catch (error) {
    return '';
  }
};