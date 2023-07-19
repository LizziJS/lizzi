import { zz } from "@lizzi/core";

type Props = {
  id: string;
  kind: "youtube";
  title: string;
  duration: number;
};

export class Song {
  readonly id;
  readonly kind;
  readonly title;
  readonly duration;

  protected readonly _isPlaying = zz.Boolean(false);
  readonly isPlaying = this._isPlaying.readonly();

  constructor({ id, kind, title, duration }: Props) {
    this.id = id;
    this.kind = kind;
    this.title = title;
    this.duration = duration;
  }

  startPlaying() {
    this._isPlaying.value = true;
  }

  stopPlaying() {
    this._isPlaying.value = false;
  }
}
