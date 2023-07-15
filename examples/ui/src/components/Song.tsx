import { zz } from "@lizzi/core";
import { net, sync, sync2, sync3 } from "../lib/sync";

@sync.object("song")
export class Song {
  @sync.var readonly id = zz.string();
  @sync.var readonly kind = zz.string<"youtube">();
  @sync.var readonly title = zz.string();
  @sync.var readonly duration = zz.integer();
  readonly isSynced = net.isSynced(this);
}

@sync.object("radio")
export class Radio {
  @sync.autosync
  @sync.var
  readonly songs = zz.array<Song>();

  @sync.var readonly playingNow = zz.object<Song>();
  readonly isLocked = net.isLocked(this);
}
