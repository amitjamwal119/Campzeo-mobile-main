import { CalendarEvent, Post } from "@/types/types";

export const mapEvents = (posts: Post[]): CalendarEvent[] => {
  return posts.map((post) => {
    const start = new Date(post.scheduledTime);

    return {
      id: post.id,
      title: post.campaign,
      start: start,
      end: start, // No duration → same as start
      platform: post.platform,
      message: post.message,
      campaign: post.campaign
    };
  });
};
