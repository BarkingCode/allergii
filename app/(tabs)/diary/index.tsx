import { useContext, useEffect } from "react";

import { GlobalContext } from "@/context/global";
import { Text } from "@/components/ui/Typography";
import { PageView } from "@/components/ui/Containers";
import NoAccess from "@/components/screens/NoAccess";
import Loading from "@/components/ui/Loading";
import DiaryDashboard from "@/components/screens/DiaryDashboard";

import { useAuth } from "@/func/useAuth";

import AuthNavigator from "@/components/screens/AuthNavigator";
import { useSubscribed } from "@/func/useSubscribed";

const Diary = () => {
  const { state } = useContext(GlobalContext);
  const { subscribed, loading: subLoading } = useSubscribed();
  const { user } = useAuth();

  if (state.loading || subLoading) {
    return <Loading />;
  }

  if (!user) {
    return <AuthNavigator />;
  }
  
  if (!subscribed) {
    return <NoAccess />;
  }

  return <DiaryDashboard />;
};

export default Diary;
