import { PageScrollView } from "@/components/ui/Containers";
import { Text, SectionTitle, Body, Caption } from "@/components/ui/Typography";
import styled from "styled-components";
import { View } from "react-native";

const Terms = () => {
  return (
    <PageScrollView>
      <Section>
        <SectionTitle>Terms of Service</SectionTitle>
        <Caption color="soft">Last updated: January 2026</Caption>
      </Section>

      <Section>
        <Text>1. Acceptance of Terms</Text>
        <Body>
          By downloading, installing, or using W-Allergy ("the App"), you agree
          to be bound by these Terms of Service. If you do not agree to these
          terms, please do not use the App.
        </Body>
      </Section>

      <Section>
        <Text>2. Description of Service</Text>
        <Body>
          W-Allergy provides weather, air quality, and pollen information to
          help users manage allergies and plan their daily activities. The App
          uses third-party data sources and AI-powered suggestions.
        </Body>
      </Section>

      <Section>
        <Text>3. User Accounts</Text>
        <Body>
          You may create an account to access additional features like the
          symptom diary. You are responsible for maintaining the confidentiality
          of your account credentials and for all activities under your account.
        </Body>
      </Section>

      <Section>
        <Text>4. Health Disclaimer</Text>
        <Body>
          The information provided by W-Allergy is for informational purposes
          only and is not intended as medical advice. Always consult a
          healthcare professional for medical concerns. The App's AI suggestions
          are not a substitute for professional medical advice.
        </Body>
      </Section>

      <Section>
        <Text>5. Data Accuracy</Text>
        <Body>
          Weather, air quality, and pollen data are sourced from third-party
          providers. While we strive for accuracy, we cannot guarantee the
          completeness or accuracy of this information. Use the data at your own
          discretion.
        </Body>
      </Section>

      <Section>
        <Text>6. Subscription Services</Text>
        <Body>
          Some features require a paid subscription. Subscriptions automatically
          renew unless cancelled at least 24 hours before the end of the current
          period. Manage subscriptions through your device's app store settings.
        </Body>
      </Section>

      <Section>
        <Text>7. Intellectual Property</Text>
        <Body>
          All content, features, and functionality of the App are owned by
          Barking Code and are protected by international copyright and
          trademark laws.
        </Body>
      </Section>

      <Section>
        <Text>8. Limitation of Liability</Text>
        <Body>
          To the fullest extent permitted by law, Barking Code shall not be
          liable for any indirect, incidental, special, or consequential damages
          arising from your use of the App.
        </Body>
      </Section>

      <Section>
        <Text>9. Changes to Terms</Text>
        <Body>
          We reserve the right to modify these terms at any time. Continued use
          of the App after changes constitutes acceptance of the new terms.
        </Body>
      </Section>

      <Section>
        <Text>10. Contact</Text>
        <Body>
          For questions about these Terms, contact us at support@barkingcode.com
        </Body>
      </Section>
    </PageScrollView>
  );
};

const Section = styled(View)`
  width: 100%;
  gap: 8px;
  margin-bottom: 16px;
`;

export default Terms;
