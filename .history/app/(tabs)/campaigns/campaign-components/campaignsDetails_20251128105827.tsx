import React, { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampaignCard, { Campaign } from "./campaignCard";
import CampaignPostForm from "./campaignPostForm";
// import CampaignPostView, { CampaignPostData } from "./campaign-components/campaignPostView";
// import CampaignPostForm from "./campaign-components/campaignPostForm";

export default function CampaignsDetails() {
  const { campaign: campaignStr } = useLocalSearchParams();
  const campaign: Campaign = JSON.parse(campaignStr as string);

  // State to hold posts for this campaign
  const [campaignPosts, setCampaignPosts] = useState<CampaignPostData[]>([]);

  // State to track which platform form is open
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Handler to open the post form
  const handlePost = (platform?: string) => {
    if (platform) setSelectedPlatform(platform);
    else router.push("/campaigns/campaignPost");
  };

  // Handler to save a post
  const handleSavePost = (post: CampaignPostData) => {
    setCampaignPosts((prev) => [...prev, post]);
    setSelectedPlatform(null);
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <CampaignCard
        campaign={campaign}
        onDelete={() => {}}
        onCopy={() => {}}
        onToggleShow={() => {}}
        showActions={false}               // hide all icons
        alwaysExpanded={true}             // always show description & dates
        postButtonTopRight={true}         // show Post button at top right
        onPressPost={() => handlePost()}  // open post form
        hidePostsHeading={true}           // hide bottom "Posts" heading
      />

      {/* Render the Post Form if a platform is selected */}
      {selectedPlatform && (
        <CampaignPostForm
          platform={selectedPlatform}
          onClose={() => setSelectedPlatform(null)}
          onSave={handleSavePost} // pass handler to save the post
        />
      )}

      {/* Show posts under the campaign */}
      <CampaignPostView posts={campaignPosts} />
    </View>
  );
}
