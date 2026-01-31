import { PageScrollView } from "@/components/ui/Containers";
import { Text, SectionTitle, Body, Caption } from "@/components/ui/Typography";
import styled from "styled-components";
import { View } from "react-native";

const Privacy = () => {
  return (
    <PageScrollView>
      <Section>
        <SectionTitle>Privacy Policy</SectionTitle>
        <Caption color="soft">Last updated: January 2026</Caption>
      </Section>

      <Section>
        <Text>1. Information We Collect</Text>
        <Body>
          <Bold>Location Data:</Bold> With your permission, we collect your
          device's location to provide local weather, air quality, and pollen
          information. This data is not stored on our servers beyond what's
          needed to fetch weather data.
        </Body>
        <Body>
          <Bold>Account Information:</Bold> If you create an account, we collect
          your email address for authentication purposes.
        </Body>
        <Body>
          <Bold>Symptom Diary Data:</Bold> Health information you voluntarily
          enter in the diary feature is stored securely and associated with your
          account.
        </Body>
      </Section>

      <Section>
        <Text>2. How We Use Your Information</Text>
        <Body>• Provide personalized weather and allergy information</Body>
        <Body>• Generate AI-powered health suggestions based on your diary entries</Body>
        <Body>• Improve the App's features and user experience</Body>
        <Body>• Send important updates about the App (if you opt in)</Body>
      </Section>

      <Section>
        <Text>3. Third-Party Services</Text>
        <Body>We use the following third-party services:</Body>
        <Body>• <Bold>Firebase (Google):</Bold> Authentication and data storage</Body>
        <Body>• <Bold>Google Air Quality API:</Bold> Air quality data</Body>
        <Body>• <Bold>Google Pollen API:</Bold> Pollen information</Body>
        <Body>• <Bold>WeatherAPI:</Bold> Weather forecasts</Body>
        <Body>• <Bold>RevenueCat:</Bold> Subscription management</Body>
        <Body>
          Each service has its own privacy policy governing data they collect.
        </Body>
      </Section>

      <Section>
        <Text>4. Data Security</Text>
        <Body>
          We implement industry-standard security measures to protect your data.
          Your symptom diary data is encrypted and stored securely on Firebase
          servers. We do not sell or share your personal data with third parties
          for marketing purposes.
        </Body>
      </Section>

      <Section>
        <Text>5. Your Rights (GDPR)</Text>
        <Body>If you're in the EU, you have the right to:</Body>
        <Body>• Access your personal data</Body>
        <Body>• Correct inaccurate data</Body>
        <Body>• Request deletion of your data</Body>
        <Body>• Export your data</Body>
        <Body>• Withdraw consent at any time</Body>
        <Body>
          To exercise these rights, go to Profile → Settings → Delete Account,
          or contact us at privacy@barkingcode.com
        </Body>
      </Section>

      <Section>
        <Text>6. Data Retention</Text>
        <Body>
          We retain your data for as long as your account is active. If you
          delete your account, we will delete your personal data within 30 days,
          except where we're required to retain it by law.
        </Body>
      </Section>

      <Section>
        <Text>7. Children's Privacy</Text>
        <Body>
          The App is not intended for children under 13. We do not knowingly
          collect data from children under 13. If you believe we have collected
          such data, please contact us immediately.
        </Body>
      </Section>

      <Section>
        <Text>8. Changes to This Policy</Text>
        <Body>
          We may update this Privacy Policy from time to time. We will notify
          you of significant changes through the App or by email.
        </Body>
      </Section>

      <Section>
        <Text>9. Contact Us</Text>
        <Body>
          For privacy-related questions or concerns:{"\n"}
          Email: privacy@barkingcode.com{"\n"}
          Address: Amsterdam, Netherlands
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

const Bold = styled(Text)`
  font-weight: bold;
`;

export default Privacy;
