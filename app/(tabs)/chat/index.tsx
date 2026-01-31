import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components";
import * as Application from "expo-application";

import { GlobalContext } from "@/context/global";
import { Text, Body, Caption } from "@/components/ui/Typography";
import { PageView } from "@/components/ui/Containers";
import Loading from "@/components/ui/Loading";

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

import { ENDPOINTS } from "@/lib/agentConfig";

// Quick action suggestions
const QUICK_ACTIONS = [
  "How are allergies today?",
  "What's the pollen forecast?",
  "Any tips for my symptoms?",
];

const Chat = () => {
  const { state } = useContext(GlobalContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Get device ID on mount
  useEffect(() => {
    const getDeviceId = async () => {
      try {
        const id = await Application.getAndroidId() || 
                   await Application.getIosIdForVendorAsync() ||
                   `device-${Date.now()}`;
        setDeviceId(id);
      } catch (error) {
        setDeviceId(`device-${Date.now()}`);
      }
    };
    getDeviceId();
  }, []);

  // Send message to agent
  const sendMessage = async (text: string) => {
    if (!text.trim() || !deviceId || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(ENDPOINTS.chat, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          message: text.trim(),
          location: {
            latitude: state.location.latitude,
            longitude: state.location.longitude,
          },
        }),
      });

      const data = await response.json();

      if (data.response) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  if (state.loading) {
    return <Loading />;
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble isUser={item.role === "user"}>
      <MessageText isUser={item.role === "user"}>{item.content}</MessageText>
    </MessageBubble>
  );

  const renderEmptyState = () => (
    <EmptyContainer>
      <WelcomeText>👋 Hi! I'm your Allergy Advisor</WelcomeText>
      <Body>
        Ask me about today's conditions, get personalized tips, or check the
        pollen forecast.
      </Body>
      <QuickActionsContainer>
        {QUICK_ACTIONS.map((action, index) => (
          <QuickActionButton
            key={index}
            onPress={() => sendMessage(action)}
          >
            <QuickActionText>{action}</QuickActionText>
          </QuickActionButton>
        ))}
      </QuickActionsContainer>
    </EmptyContainer>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={90}
    >
      <Container dark={state.dark}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 16,
            paddingBottom: 8,
          }}
          ListEmptyComponent={renderEmptyState}
        />

        {isLoading && (
          <TypingIndicator>
            <ActivityIndicator size="small" color="#007AFF" />
            <Caption color="soft" style={{ marginLeft: 8 }}>
              Thinking...
            </Caption>
          </TypingIndicator>
        )}

        <InputContainer dark={state.dark}>
          <StyledInput
            dark={state.dark}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about allergies..."
            placeholderTextColor={state.dark ? "#888" : "#999"}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage(inputText)}
            returnKeyType="send"
          />
          <SendButton
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <SendButtonText disabled={!inputText.trim() || isLoading}>
              Send
            </SendButtonText>
          </SendButton>
        </InputContainer>
      </Container>
    </KeyboardAvoidingView>
  );
};

// Styled Components
const Container = styled(View)<{ dark: boolean }>`
  flex: 1;
  background-color: ${({ dark, theme }) =>
    dark ? theme.colors.page.bg.start : theme.colors.page.bg.end};
`;

const EmptyContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const WelcomeText = styled(Text)`
  font-size: 24px;
  margin-bottom: 12px;
  text-align: center;
`;

const QuickActionsContainer = styled(View)`
  margin-top: 24px;
  width: 100%;
  gap: 12px;
`;

const QuickActionButton = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.card.background};
  padding: 14px 20px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.card.border};
`;

const QuickActionText = styled(Text)`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MessageBubble = styled(View)<{ isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  margin-bottom: 8px;
  align-self: ${({ isUser }) => (isUser ? "flex-end" : "flex-start")};
  background-color: ${({ isUser, theme }) =>
    isUser ? "#007AFF" : theme.colors.card.background};
  border: ${({ isUser, theme }) =>
    isUser ? "none" : `1px solid ${theme.colors.card.border}`};
`;

const MessageText = styled(Text)<{ isUser: boolean }>`
  color: ${({ isUser, theme }) =>
    isUser ? "#FFFFFF" : theme.colors.text.primary};
  line-height: 22px;
`;

const TypingIndicator = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
`;

const InputContainer = styled(View)<{ dark: boolean }>`
  flex-direction: row;
  align-items: flex-end;
  padding: 12px 16px;
  padding-bottom: 24px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.card.border};
  background-color: ${({ dark, theme }) =>
    dark ? theme.colors.page.bg.start : theme.colors.page.bg.end};
`;

const StyledInput = styled(TextInput)<{ dark: boolean }>`
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 16px;
  border-radius: 20px;
  background-color: ${({ dark }) => (dark ? "#2C2C2E" : "#F2F2F7")};
  color: ${({ dark }) => (dark ? "#FFFFFF" : "#000000")};
  font-size: 16px;
  margin-right: 8px;
`;

const SendButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
  padding: 10px 16px;
  border-radius: 20px;
  background-color: ${({ disabled }) => (disabled ? "#CCCCCC" : "#007AFF")};
`;

const SendButtonText = styled(Text)<{ disabled?: boolean }>`
  color: ${({ disabled }) => (disabled ? "#888888" : "#FFFFFF")};
  font-weight: 600;
`;

export default Chat;
