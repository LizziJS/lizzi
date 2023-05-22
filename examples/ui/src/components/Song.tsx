import { zz } from "@lizzi/core";
import { net, sync, sync2, sync3 } from "../lib/sync";

@sync3.object("song")
@sync2.object("song")
@sync.object("song")
export class Song {
  @sync3.var @sync2.var @sync.var readonly id = zz.string();
  @sync3.var @sync2.var @sync.var readonly kind = zz.string<"youtube">();
  @sync3.var @sync2.var @sync.var readonly title = zz.string();
  @sync3.var @sync2.var @sync.var readonly duration = zz.integer();
  readonly isSynced = net.isSynced(this);
}

@sync3.object("radio")
@sync2.object("radio")
@sync.object("radio")
export class Radio {
  @sync3.autosync
  @sync3.var
  @sync2.autosync
  @sync2.var
  @sync.autosync
  @sync.var
  readonly songs = zz.array<Song>();
  @sync3.var @sync2.var @sync.var readonly playingNow = zz.object<Song>();
  readonly isLocked = net.isLocked(this);
}
