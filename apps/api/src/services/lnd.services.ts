import { authenticatedLndGrpc } from 'lightning';
import lndConfig from '../config/lnd.config';

function createLndConnection(
  socket: string,
  cert: string,
  macaroon: string,
) {
  return authenticatedLndGrpc({
    socket,
    cert,
    macaroon,
  })
}

export const nodes = {
  receiver: createLndConnection(
    lndConfig.receiverSocket!,
    lndConfig.receiverCert!,
    lndConfig.receiverMacaroon!,
  ),
  sender: createLndConnection(
    lndConfig.senderSocket!,
    lndConfig.senderCert!,
    lndConfig.senderMacaroon!,
  ),
};
