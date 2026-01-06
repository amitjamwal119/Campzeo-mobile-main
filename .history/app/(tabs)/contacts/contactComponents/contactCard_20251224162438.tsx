<FormControl>
  <FormControl.Label>
    <Text className="text-base mt-3 font-semibold text-gray-700">
      Associate with Campaigns
    </Text>
  </FormControl.Label>

  {loadingCampaigns ? (
    <ActivityIndicator size="small" color="#dc2626" />
  ) : campaignOptions.length === 0 ? (
    <Text>No campaigns available</Text>
  ) : (
    <View className="border border-gray-300 rounded-lg p-4">
      {campaignOptions.map((campaign) => {
        const checked = selectedCampaigns.includes(campaign.id);
        return (
          <TouchableOpacity
            key={campaign.id}
            onPress={() => {
              const current = [...selectedCampaigns];
              if (checked) {
                setValue(
                  "campaignIds",
                  current.filter((id) => id !== campaign.id)
                );
              } else {
                setValue("campaignIds", [...current, campaign.id]);
              }
            }}
            className="flex-row items-center my-2"
          >
            <View className="w-5 h-5 mr-3 border rounded items-center justify-center border-gray-300">
              {checked && (
                <Ionicons name="checkmark-outline" size={16} color="#dc2626" />
              )}
            </View>
            <Text>{campaign.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )}
</FormControl>
