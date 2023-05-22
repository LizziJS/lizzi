import { zzNode } from "@lizzi/node";
import { Radio, Song } from "./Song";
import { store } from "../lib/sync";

export class RadioComponent extends zzNode {
  readonly radio = new Radio();

  constructor() {
    super();

    store.sync(this.radio, "root");

    const song = new Song();

    this.radio.songs.add([song, new Song()]);

    this.radio.playingNow.value = song;

    this.radio.playingNow.value = null;

    this.append(
      <>
        {this.radio.songs.map((song) => (
          <div>
            <span>{song.title}</span>
            <span>{song.duration}</span>
          </div>
        ))}
      </>
    );
  }
}
