import { useContext, useEffect } from "react";

import styled from "styled-components";

import { GlobalContext } from "../../../context/global";
import { storeData } from "../../../func/storage";

import { Text, Caption } from "@/components/ui/Typography";
import { PageScrollView, View } from "@/components/ui/Containers";
import { SegmentedControlComponent } from "@/components/ui/SegmentedControl";
import { NavButton } from "@/components/ui/NavButton";
import { DividerH } from "@/components/ui/Elements";
import { UserContext } from "@/context/user";

import { useAuth } from "@/func/useAuth";
import { useUpdateSettings } from "@/func/useFirebase";

const Setting = () => {
  const { user } = useAuth();
  const { userState, userDispatch } = useContext(UserContext);

  useEffect(() => {
    storeData(userState, "@userPreferences");
    //add those settings to firebase under user.uid

    if (user) {
      useUpdateSettings(user.uid, userState.settings);
    }
  }, [userState.settings]);

  return (
    <PageScrollView>
      <ViewContainer>
        <Text>Temperature Type</Text>
        <SegmentedControlComponent
          values={["Celsius", "Fahrenheit"]}
          selectedIndex={userState.settings.tempType}
          onChange={(result) => {
            userDispatch({
              type: "SET_TEMP_TYPE",
              payload: result,
            });
          }}
        />
      </ViewContainer>
      <ViewContainer>
        <Text>Distance Type</Text>
        <SegmentedControlComponent
          values={["Kilometer", "Miles"]}
          selectedIndex={userState.settings.distanceType}
          onChange={(result) => {
            userDispatch({
              type: "SET_DIRECTION_TYPE",
              payload: result,
            });
          }}
        />
      </ViewContainer>
      <ViewContainer>
        <Text>Is Allergy Information Important For You?</Text>
        <SegmentedControlComponent
          values={["Yes", "No"]}
          selectedIndex={userState.settings.allergy}
          onChange={(result) => {
            userDispatch({
              type: "SET_ALLERGY",
              payload: result,
            });
          }}
        />
      </ViewContainer>
      {/* <ViewContainer>
        <Text>Push Notifications</Text>
        <SegmentedControlS
          values={["Yes", "No"]}
          selectedIndex={userState.settings.notifications}
          onChange={(event) => {
            userDispatch({
              type: "SET_NOTIFICATIONS",
              payload: event.nativeEvent.selectedSegmentIndex,
            });
          }}
        />
      </ViewContainer> */}

      <DividerH />

      <ViewContainer>
        <Caption color="soft">Legal</Caption>
        <NavButton url="/(tabs)/profile/terms" title="Terms of Service" />
        <NavButton url="/(tabs)/profile/privacy" title="Privacy Policy" />
      </ViewContainer>

      {user && (
        <>
          <DividerH />
          <ViewContainer>
            <Caption color="soft">Danger Zone</Caption>
            <NavButton
              url="/(tabs)/profile/delete-account"
              title="Delete Account"
            />
          </ViewContainer>
        </>
      )}
    </PageScrollView>
  );
};

const ViewContainer = styled(View)`
  width: 100%;
  gap: 16px;
`;

export default Setting;
