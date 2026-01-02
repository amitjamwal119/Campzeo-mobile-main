const [postDetails, setPostDetails] = useState<any>(null);

useEffect(() => {
  if (!campaignId || !postId) return;

  let isMounted = true; // prevent updating state if unmounted

  const fetchPostDetails = async () => {
    try {
      const url = `https://campzeo-v1-oym2.vercel.app/api/campaigns/${campaignId}/posts/${postId}`;
      console.log("Fetching post details from:", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log("Post details API response:", data);

      if (isMounted) setPostDetails(data.post); // ✅ update state once
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  fetchPostDetails();

  return () => {
    isMounted = false; // cleanup
  };
}, [campaignId, postId]);
