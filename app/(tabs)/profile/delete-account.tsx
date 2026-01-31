import { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import styled from "styled-components";
import { router } from "expo-router";

import { PageView } from "@/components/ui/Containers";
import { Text, SectionTitle, Body, Caption } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { Input } from "@/components/ui/Input";
import { DividerH } from "@/components/ui/Elements";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useAuth } from "@/func/useAuth";

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const { user, loading, error, deleteAccount, deleteConfirmed, resetError } =
    useAuth();

  const canDelete =
    password.length >= 8 && confirmText.toLowerCase() === "delete my account";

  useEffect(() => {
    if (deleteConfirmed) {
      Alert.alert(
        "Account Deleted",
        "Your account and all associated data have been permanently deleted.",
        [{ text: "OK", onPress: () => router.replace("/(tabs)/now") }]
      );
    }
  }, [deleteConfirmed]);

  useEffect(() => {
    resetError();
  }, []);

  const handleDelete = async () => {
    Alert.alert(
      "Final Confirmation",
      "This action cannot be undone. All your data will be permanently deleted. Are you absolutely sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: async () => {
            const success = await deleteAccount(password);
            if (!success) {
              Alert.alert(
                "Delete Failed",
                error || "Could not delete account. Please check your password and try again."
              );
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <PageView center verticalCenter>
        <Text>You need to be logged in to delete your account.</Text>
        <SecondaryButton
          title="Go Back"
          onPress={() => router.back()}
        />
      </PageView>
    );
  }

  return (
    <PageView>
      <Section>
        <SectionTitle>Delete Your Account</SectionTitle>
        <WarningBox>
          <Body>⚠️ This action is permanent and cannot be undone.</Body>
        </WarningBox>
      </Section>

      <Section>
        <Text>What will be deleted:</Text>
        <Body>• Your account and login credentials</Body>
        <Body>• All symptom diary entries</Body>
        <Body>• Your preferences and settings</Body>
        <Body>• Any subscription will be cancelled</Body>
      </Section>

      <DividerH />

      <Section>
        <Caption color="soft">
          To confirm, enter your password and type "delete my account" below:
        </Caption>

        <Input
          secureTextEntry
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          textContentType="password"
        />

        <Input
          placeholder='Type "delete my account"'
          value={confirmText}
          onChangeText={setConfirmText}
          autoCapitalize="none"
        />

        {error && <ErrorText>{error}</ErrorText>}
      </Section>

      <ButtonSection>
        <DeleteButton onPress={handleDelete} disabled={!canDelete || loading}>
          <Text color="invert" center>
            {loading ? "Deleting..." : "Delete My Account"}
          </Text>
        </DeleteButton>

        <SecondaryButton title="Cancel" onPress={() => router.back()} />
      </ButtonSection>

      <LoadingOverlay visible={loading} />
    </PageView>
  );
};

const Section = styled(View)`
  width: 100%;
  gap: 12px;
  margin-bottom: 24px;
`;

const ButtonSection = styled(View)`
  width: 100%;
  gap: 16px;
  margin-top: auto;
  padding-bottom: 32px;
`;

const WarningBox = styled(View)`
  background-color: ${({ theme }) => theme.colors.danger || "#ff4444"}20;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.danger || "#ff4444"}40;
`;

const DeleteButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.button.bg.disabled.default : "#dc2626"};
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.border.radius.button};
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.danger || "#ff4444"};
`;

export default DeleteAccount;
