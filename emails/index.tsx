import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface SubscriptionsEmailProps {
  subscriptions: string;
}

const baseUrl = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}` : "";

export const SubscriptionsEmail = ({
  subscriptions,
}: SubscriptionsEmailProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Bienvenu chez Discophiles !</Preview>
      <Body className="bg-white font-sans h-[100vh]">
        <Container
          className="m-auto p-5 bg-no-repeat bg-bottom"
          style={{ backgroundImage: 'url("/img/img.jpg")' }}
        >
          <Img
            src={`/img/img.jpg`}
            width={48}
            height={48}
            alt="Images presentation"
            className="mb-4"
          />
          <Heading className="text-2xl font-bold mt-12 text-center">
            🪄 Votre souscription à notre newsletter est bien prise en compte !
          </Heading>
          <Section className="my-6">
            <Text className="text-lg leading-6">
              <Link className="text-pink-500" href={subscriptions}>
                👉 Cliquez ici pour revenir au site ! 👈
              </Link>
            </Text>
            <Text className="text-lg leading-6 mt-4">
              {`Si vous n'avez pas souscrit à notre newsletter, vous pouvez ignorer ce message.`}
            </Text>
          </Section>
          <Text className="text-lg leading-6 mt-4">
            Bisous,
            <br />- Discophiles
          </Text>
          <Hr className="border-t border-gray-300 mt-12" />
          <Img
            src={`/img/img.jpg`}
            width={32}
            height={32}
            className="grayscale my-5"
          />
          <Text className="text-xs text-gray-500">Discophiles</Text>
          <Text className="text-xs text-gray-500 mt-1">Chez ta Maman !</Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default SubscriptionsEmail;
