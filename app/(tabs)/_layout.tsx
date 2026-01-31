import React, { useContext } from "react";

import { Tabs } from "expo-router";

import { dark, global, light } from "@/constants/Theme";
import { GlobalContext } from "@/context/global";
import { NowIcon } from "@/assets/icons/navigation/now";
import { NowActiveIcon } from "@/assets/icons/navigation/nowactive";
import { DailyIcon } from "@/assets/icons/navigation/daily";
import { DailyActiveIcon } from "@/assets/icons/navigation/dailyactive";
import { UserActiveIcon } from "@/assets/icons/navigation/userActive";
import { UserIcon } from "@/assets/icons/navigation/user";
import { DiaryActiveIcon } from "@/assets/icons/navigation/diaryActive";
import { DiaryIcon } from "@/assets/icons/navigation/diary";
import { ChatIcon } from "@/assets/icons/navigation/chat";
import { ChatActiveIcon } from "@/assets/icons/navigation/chatActive";

export default function TabLayout() {
  const { state } = useContext(GlobalContext);

  const tabSelectedIconColor = state.dark
    ? dark.colors.tabBar.selected.icon
    : light.colors.tabBar.selected.icon;

  const tabIconColor = state.dark
    ? dark.colors.tabBar.default.icon
    : light.colors.tabBar.default.icon;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: state.dark
          ? dark.colors.tabBar.selected.text
          : light.colors.tabBar.selected.text,
        tabBarInactiveTintColor: state.dark
          ? dark.colors.tabBar.default.text
          : light.colors.tabBar.default.text,
        tabBarLabelStyle: {
          fontFamily: global.font.family.primaryBold,
        },
        tabBarStyle: {
          backgroundColor: state.dark
            ? dark.colors.page.bg.start
            : light.colors.page.bg.start,
        },
      }}
    >
      <Tabs.Screen redirect name="index" />
      <Tabs.Screen
        name="now"
        options={{
          title: "Now",
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <NowActiveIcon color={tabSelectedIconColor} />;
            } else {
              return <NowIcon color={tabIconColor} />;
            }
          },
        }}
      />

      <Tabs.Screen
        name="forecast"
        options={{
          title: "Forecast",
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <DailyActiveIcon color={tabSelectedIconColor} />;
            } else {
              return <DailyIcon color={tabIconColor} />;
            }
          },
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <ChatActiveIcon color={tabSelectedIconColor} />;
            } else {
              return <ChatIcon color={tabIconColor} />;
            }
          },
        }}
      />

      <Tabs.Screen
        name="diary"
        options={{
          title: "Diary",

          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <DiaryActiveIcon color={tabSelectedIconColor} />;
            } else {
              return <DiaryIcon color={tabIconColor} />;
            }
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <UserActiveIcon color={tabSelectedIconColor} />;
            } else {
              return <UserIcon color={tabIconColor} />;
            }
          },
        }}
      />
    </Tabs>
  );
}
