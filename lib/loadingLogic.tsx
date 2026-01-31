import * as Location from "expo-location";

import { GlobalContext } from "@/context/global";
import { clearAll, getData } from "@/func/storage";
import useFetch from "@/func/useFetch";
import { PropsWithChildren, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import { ApiDataContext } from "@/context/apidata";
import { UserContext } from "@/context/user";

const LoadingLogic = ({ children, complete }: any) => {
  const colorScheme = useColorScheme();
  const { data, loading, error, fetchData } = useFetch();

  const { state, dispatch } = useContext(GlobalContext);
  const { userState, userDispatch } = useContext(UserContext);

  // Load the data from the api when fetch a new data

  useEffect(() => {
    (async () => {
      // Check the storage for global data and load it

      const userPreferences = await getData("@userPreferences");

      // Wait until checking the user location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      try {
        if (userPreferences) {
          userDispatch({
            type: "LOAD_USER_PREFERENCES",
            payload: userPreferences,
          });
        }

        // If user gives location permission, take that location and fetch the data
        if (status === "granted") {
          dispatch({
            type: "SET_LOCATION_PERMISSION",
          });

          const {
            coords: { longitude, latitude },
          } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });
          dispatch({
            type: "SET_LOCATION",
            payload: { latitude, longitude },
          });
          await fetchData(latitude, longitude);
        }
        // If user denies location permission, set the location to London
        else {
          dispatch({
            type: "SET_NO_LOCATION_PERMISSION",
          });
          await fetchData(state.location.latitude, state.location.longitude);
        }
        dispatch({
          type: "SET_DARK_MODE",
          payload: colorScheme === "dark" ? true : false,
        });
      } catch (error) {
        console.error(error);
      } finally {
        console.log("loading logic complete");

        await complete();
      }
    })();
  }, []);

  return children;
};

export default LoadingLogic;
