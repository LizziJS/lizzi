import { zzString } from "@lizzi/core";
import { Body } from "@lizzi/template";

import "./app.css";

const lizzi = new zzString("lizzi");

Body(<div>Hello {lizzi}!</div>);
