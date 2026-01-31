import { PropsWithChildren, useReducer } from "react";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { dark, light } from "@/constants/Theme";
import { GlobalContext, initialState, reducer } from "../context/global";
import {
  ApiDataContext,
  apiDataInitialState,
  apiDataReducer,
} from "../context/apidata";
import PurchaseProvider from "@/lib/purchaseProvider";
import { AuthProvider } from "@/func/useAuth";
import { UserContext, userInitialState, userReducer } from "@/context/user";

const Providers = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [userState, userDispatch] = useReducer(userReducer, userInitialState);
  const [apiDataState, apiDataDispatch] = useReducer(
    apiDataReducer,
    apiDataInitialState
  );

  const queryClient = new QueryClient();

  return (
    // <QueryClientProvider client={queryClient}>
    <GlobalContext.Provider value={{ state, dispatch }}>
      <UserContext.Provider value={{ userState, userDispatch }}>
        <ApiDataContext.Provider value={{ apiDataState, apiDataDispatch }}>
          <AuthProvider>
            {/* <NowAiContext.Provider value={{ nowAiState, nowAiDispatch }}> */}
            <ThemeProvider theme={state.dark ? dark : light}>
              {/* {state.notifications == 0 && <PushNotification />} */}
              <PurchaseProvider>
                {children}
              </PurchaseProvider>
            </ThemeProvider>
            {/* </NowAiContext.Provider> */}
          </AuthProvider>
        </ApiDataContext.Provider>
      </UserContext.Provider>
    </GlobalContext.Provider>
    // </QueryClientProvider>
  );
};

export default Providers;
