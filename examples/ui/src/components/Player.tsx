import { zz } from "@lizzi/core";
import { Song } from "./Song";

export class PlayerStore {
  readonly playingNow = zz.Object<Song>();
  readonly playingTimeStart = zz.Number();

  constructor() {
    this.playingNow.itemListener(
      (song) => song.startPlaying(),
      (oldsong) => oldsong.stopPlaying()
    );
  }

  play(song: Song, startPlayingTime: number) {
    this.playingNow.value = song;
    this.playingTimeStart.value = startPlayingTime;
  }

  stop() {
    this.playingNow.value = null;
    this.playingTimeStart.value = 0;
  }
}
