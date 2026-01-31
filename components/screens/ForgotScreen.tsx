import { PageScrollView, PageView } from "@/components/ui/Containers";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { useAuth } from "@/func/useAuth";

import { useContext, useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import styled from "styled-components";

import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import { UserContext } from "@/context/user";
import { DividerH } from "../ui/Elements";
import { global } from "@/constants/Theme";
import { Text } from "../ui/Typography";
import { PageState } from "./AuthNavigator";
import LoadingOverlay from "../ui/LoadingOverlay";
import { Input } from "../ui/Input";

//this screen take a function from parent compontent to update a page state
const ForgotScreen = ({ setPage }: { setPage: (page: PageState) => void }) => {
  const [disabled, setDisabled] = useState(true);
  const {
    user,
    error,
    setUserInput,
    userInput,
    loading,
    resetError,
    resetPassword,
    resetEmailSent,
  } = useAuth();

  useEffect(() => {
    if (user) {
      router.back();
    }
  }, [user]);

  useEffect(() => {
    if (userInput.email === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [userInput]);

  const handleChange = (name: string, value: string) => {
    const newValue = name === "email" ? value.toLowerCase() : value;
    setUserInput((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <PageView center verticalCenter>
      <Wrapper>
        <Container>
          <Text>Forgot Password</Text>
          <Input
            placeholder="email"
            value={userInput.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            style={{ fontFamily: global.font.family.primary }}
          />
          {error && <Text>{error}</Text>}
          {resetEmailSent && (
            <Text>Password reset email sent! Check your inbox.</Text>
          )}
        </Container>
        <Wrapper>
          <PrimaryButton
            title={resetEmailSent ? "Resend Email" : "Reset Password"}
            disabled={disabled}
            onPress={async () => {
              await resetPassword();
            }}
          />
          <DividerH />
          <Container>
            <SecondaryButton
              title="Log In"
              onPress={() => {
                resetError();
                setPage("signin");
              }}
            />
            <SecondaryButton
              title="Create an Account"
              onPress={() => {
                resetError();
                setPage("signup");
              }}
            />
          </Container>
        </Wrapper>
      </Wrapper>
      <LoadingOverlay visible={loading} />
    </PageView>
  );
};

export default ForgotScreen;

const Container = styled(View)`
  gap: 16px;
  width: 100%;
`;

const Wrapper = styled(View)`
  gap: 32px;
  width: 100%;
`;
