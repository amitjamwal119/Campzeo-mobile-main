import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { Button, ButtonText } from "@gluestack-ui/themed";
// import { router } from "expo-router";

export default function Pagination() {
  return (
    <>
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Previous */}
        <Button
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#d1d5db",
            backgroundColor: "#ffffff",
            opacity: 0.5,
          }}
        >
          <Ionicons name="chevron-back" size={20} color="gray" />
        </Button>

        {/* Pages */}
        <ThemedView
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
          }}
        >
          <Button
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#d1d5db",
              marginRight: 8,
              backgroundColor: "#ffffff",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ButtonText style={{ color: "black" }}>1</ButtonText>
          </Button>

          <Button
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#d1d5db",
              marginRight: 8,
              backgroundColor: "#d55b35",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ButtonText style={{ color: "white" }}>2</ButtonText>
          </Button>

          <Button
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#d1d5db",
              marginRight: 8,
              backgroundColor: "#ffffff",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ButtonText style={{ color: "black" }}>3</ButtonText>
          </Button>
        </ThemedView>

        {/* Next */}
        <Button
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#d1d5db",
            backgroundColor: "#ffffff",
            opacity: 1,
            marginLeft: 8,
          }}
        >
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Button>
      </ThemedView>
    </>
  );
}


// import { ThemedView } from "@/components/themed-view";
// import { Ionicons } from "@expo/vector-icons";
// import { Button, ButtonText } from "@gluestack-ui/themed";

// export default function Pagination() {
//   return (
//     <ThemedView className="flex-row justify-center items-center">

//       {/* Previous */}
//       <Button
//         variant="outline"
//         className="
//           px-[12px] py-[8px]
//           rounded-[12px]
//           border border-[#d1d5db]
//           bg-white
//           opacity-50
//         "
//       >
//         <Ionicons name="chevron-back" size={20} color="gray" />
//       </Button>

//       {/* Pages */}
//       <ThemedView className="flex-row items-center ml-2">

//         {/* Page 1 */}
//         <Button
//           variant="outline"
//           className="
//             px-[12px] py-[8px]
//             rounded-[12px]
//             border border-[#d1d5db]
//             mr-2
//             bg-white
//             justify-center items-center
//           "
//         >
//           <ButtonText className="text-black">1</ButtonText>
//         </Button>

//         {/* Page 2 (active) */}
//         <Button
//           variant="outline"
//           className="
//             px-[12px] py-[8px]
//             rounded-[12px]
//             border border-[#d1d5db]
//             mr-2
//             bg-[#d55b35]
//             justify-center items-center
//           "
//         >
//           <ButtonText className="text-white">2</ButtonText>
//         </Button>

//         {/* Page 3 */}
//         <Button
//           variant="outline"
//           className="
//             px-[12px] py-[8px]
//             rounded-[12px]
//             border border-[#d1d5db]
//             mr-2
//             bg-white
//             justify-center items-center
//           "
//         >
//           <ButtonText className="text-black">3</ButtonText>
//         </Button>
//       </ThemedView>

//       {/* Next */}
//       <Button
//         variant="outline"
//         className="
//           px-[12px] py-[8px]
// rounded-xl          border border-[#d1d5db]
//           bg-white
//           opacity-100
//           ml-2
//         "
//       >
//         <Ionicons name="chevron-forward" size={20} color="black" />
//       </Button>

//     </ThemedView>
//   );
// }
