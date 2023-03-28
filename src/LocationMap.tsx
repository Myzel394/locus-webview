import subDays from "date-fns/subDays";
import {dateToUnix, useNostrEvents} from "nostr-react";
import {ReactElement, useEffect, useMemo, useState} from "react";
import * as OpenPGP from "openpgp"
// @ts-ignore
import { MapContainer } from "react-leaflet/MapContainer"
// @ts-ignore
import { TileLayer } from "react-leaflet/TileLayer"
// @ts-ignore
import {Marker} from "react-leaflet/Marker";
// @ts-ignore
import {Popup} from "react-leaflet/Popup";

export default function LocationMap({
  nostrPublicKey,
  viewPrivateKey,
  signPublicKey,
}: any): ReactElement {
  const [events, setEvents] = useState<any[]>([]);

  const date = useMemo(() => subDays(new Date(), 7), []);

  const { events: encryptedEvents } = useNostrEvents({
    filter: {
      since: dateToUnix(date),
      kinds: [1000],
      authors: [nostrPublicKey],
    },
  });

  useEffect(() => {
    (async () => {
      if (!encryptedEvents) return;
      if (events.length === encryptedEvents.length) return;

      const newEvents = [];

      for (const decryptedEvent of encryptedEvents) {
        const viewKey = await OpenPGP.readPrivateKey({ armoredKey: viewPrivateKey })

        const { data: decryptedData } = await OpenPGP.decrypt({
          message: await OpenPGP.readMessage({ armoredMessage: decryptedEvent.content}),
          decryptionKeys: viewKey,
        });

        if (typeof decryptedData !== "string") {
          continue;
        }
        const message = JSON.parse(decryptedData);
        const locationPoint = JSON.parse(message.message);

        newEvents.push(locationPoint);
      }

      // @ts-ignore
      setEvents(newEvents);
    })();
  }, [encryptedEvents, viewPrivateKey, events])

  console.log(events);

  if (events.length === 0) {
    return <div>No location data found.</div>
  }

  return (
    <div style={{width: "800px", height: "800px"}}>
      <MapContainer center={[events[0]!.latitude, events[0].longitude]} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event, index) => (
          <Marker key={index} position={[event.latitude, event.longitude]}>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
