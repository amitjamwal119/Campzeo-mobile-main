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
