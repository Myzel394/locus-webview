import {ReactElement, useState} from "react";

export interface ViewKeyFormProps {
  onSubmit: (data: {
    viewPrivateKey: string;
    signPublicKey: string;
    nostrPublicKey: string;
  }) => void;
}

export default function ViewKeyForm({
  onSubmit
}: ViewKeyFormProps): ReactElement {
  const [file, setFile] = useState<File | null>(null)

  return (
    <form onSubmit={event => {
      event.preventDefault();

      const reader = new FileReader()
      reader.onload = () => {
        const data = JSON.parse(reader.result as string)
        onSubmit({
          viewPrivateKey: data.viewPrivateKey,
          signPublicKey: data.signPublicKey,
          nostrPublicKey: data.nostrPublicKey
        })
      }
      reader.readAsText(file!)
    }}>
      <label htmlFor="viewFile">Use your View Key File to view the location.</label>
      <input
        onChange={e => setFile(e.target.files![0])}
        type="file"
        id="viewFile"
      />
      <button type="submit">Submit</button>
    </form>
  )
}
