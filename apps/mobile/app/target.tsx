import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyTargetRoute() {
  const { type } = useLocalSearchParams<{ type?: string }>();

  if (typeof type === 'string' && type.length > 0) {
    return <Redirect href={{ pathname: '/target-detail', params: { type } }} />;
  }

  return <Redirect href="/(tabs)/target" />;
}
