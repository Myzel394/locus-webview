import { NostrProvider } from 'nostr-react';
import React, {useState} from 'react';
import ViewKeyForm from "./ViewKeyForm";
import LocationMap from "./LocationMap";


function App() {
  const [credentials, setCredentials] = useState<{
    viewPrivateKey: string;
    signPublicKey: string;
    nostrPublicKey: string;
  } | null>(null)

  return (
    <NostrProvider relayUrls={["wss://relay.damus.io"]} debug>
      <div>
        <ViewKeyForm onSubmit={setCredentials} />
        {credentials && (
          <LocationMap nostrPublicKey={credentials.nostrPublicKey} viewPrivateKey={credentials.viewPrivateKey} />
        )}
      </div>
    </NostrProvider>
  );
}

export default App;
