export function useUserService() {
  const isPostOwner = async (userId: string) => {
    // Logic to check post ownership
  };

  const fetchAvatarUrl = async (username: string) => {
    // Logic to fetch avatar URL
  };

  return {
    isPostOwner,
    fetchAvatarUrl
  };
}
