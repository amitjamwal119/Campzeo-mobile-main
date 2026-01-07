import { View } from "react-native";
import React from "react";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Determine pages to show
  let pagesToShow: number[] = [];
  if (totalPages <= 4) {
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    let start = Math.max(currentPage - 1, 1);
    let end = start + 2;
    if (end >= totalPages) {
      end = totalPages - 1;
      start = end - 2;
    }
    pagesToShow = [start, start + 1, start + 2];
  }

  const shouldShowPagination = totalPages > 1;

  if (!shouldShowPagination) return null;

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
      {/* Previous */}
      <Button
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#d1d5db",
          backgroundColor: "#ffffff",
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
        onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "gray" : "black"} />
      </Button>

      {/* Pages */}
      <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
        {pagesToShow.map((page) => (
          <Button
            key={page}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#d1d5db",
              // marginRight: 8,
              marginHorizontal
              backgroundColor: currentPage === page ? "#dc2626" : "#ffffff",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => onPageChange(page)}
          >
            <ButtonText style={{ color: currentPage === page ? "white" : "black" }}>{page}</ButtonText>
          </Button>
        ))}
      </View>

      {/* Next */}
      <Button
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#d1d5db",
          backgroundColor: "#ffffff",
          opacity: currentPage === totalPages ? 0.5 : 1,
          marginLeft: 8,
        }}
        onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "gray" : "black"} />
      </Button>
    </View>
  );
}
