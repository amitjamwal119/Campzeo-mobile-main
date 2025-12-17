import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      mobileApiKey: process.env.EXPO_PUBLIC_MOBILE_API_KEY,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      ...config.extra,
    },
  };
};
