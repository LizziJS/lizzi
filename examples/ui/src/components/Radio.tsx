import { zz } from "@lizzi/core";
import { Song } from "./Song";
import { PlayerStore } from "./Player";

export class RadioStore {
  readonly songs = zz.Array<Song>();
  readonly player = new PlayerStore();
  readonly startPlayingTime = zz.Number();
  readonly isPlaying = zz.Boolean(false);

  play() {
    this.isPlaying.value = true;
  }

  stop() {
    this.isPlaying.value = false;
  }

  startPlayingRadio(time: number) {
    this.startPlayingTime.value = time;
  }

  constructor() {
    this.startPlayingTime.onChange.addListener((ev) => {
      // find song to play by startPlayingTime from song list from start
      let leftDuration = Date.now() - ev.value;

      const song = this.songs.value.find((song) => {
        if (leftDuration <= song.duration) return true;

        leftDuration -= song.duration;
        return false;
      });

      if (song) {
        this.player.play(song, leftDuration);
      } else {
        this.player.stop();
      }
    });
  }
}
