interface LndConfig {
  receiverSocket: string | undefined;
  receiverMacaroon: string | undefined;
  receiverCert: string | undefined;
  senderSocket: string | undefined;
  senderMacaroon: string | undefined;
  senderCert: string | undefined;
};

const lndConfig: LndConfig = {
  receiverSocket: process.env.RECEIVER_SOCKET,
  receiverCert: process.env.RECEIVER_CERT,
  receiverMacaroon: process.env.RECEIVER_MACAROON,
  senderSocket: process.env.SENDER_SOCKET,
  senderCert: process.env.SENDER_CERT,
  senderMacaroon: process.env.SENDER_MACAROON,
};

export default lndConfig;
