import { View, Text } from "react-native";

export interface LogRecord {
  id: number;
  event: string;
  recipient: string;
  timestamp: string;
}

export default function LogsCards({ record }: { record: LogRecord }) {
  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      {/* Event */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#111827" }}>
          {record.event}
        </Text>
      </View>

      {/* Recipient */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#111827" }}>Recipient</Text>
        <Text style={{ color: "#374151" }}>{record.recipient}</Text>
      </View>

      {/* Timestamp */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#111827" }}>Timestamp</Text>
        <Text style={{ color: "#374151" }}>{record.timestamp}</Text>
      </View>
    </View>
  );
}




//  import { View } from "react-native";
// import { Skeleton, VStack, HStack } from "@gluestack-ui/themed";

// export function LogsCardSkeleton() {
//   return (
//     <View
//       style={{
//         backgroundColor: "white",
//         padding: 16,
//         borderRadius: 12,
//         marginBottom: 12,
//       }}
//     >
//       <VStack space="md">
//         {/* Event Title */}
//         <Skeleton h={20} w={150} rounded="$md" />

//         {/* Recipient Row */}
//         <HStack justifyContent="space-between" alignItems="center">
//           <Skeleton h={16} w={100} rounded="$md" />
//           <Skeleton h={16} w={120} rounded="$md" />
//         </HStack>

//         {/* Timestamp Row */}
//         <HStack justifyContent="space-between" alignItems="center">
//           <Skeleton h={16} w={100} rounded="$md" />
//           <Skeleton h={16} w={140} rounded="$md" />
//         </HStack>
//       </VStack>
//     </View>
//   );
// }
