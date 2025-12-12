import { Post } from "@/types/types";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import CalendarView from "../(calander)/CalanderComponents/calanderView";
import { fetchPosts } from "@/api/postsApi";



const CalendarWrapper = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts();
        setPosts(response.data ?? []);
      } catch (err: any) {
        console.log(err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading calendar...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return <CalendarView posts={posts} />;
};

export default CalendarWrapper;
