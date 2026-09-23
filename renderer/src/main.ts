import "./app.css"

import App from "./App.svelte"
import InstallGate from "./lib/InstallGate.svelte"
import {
  currentDevice,
  detectPlatform,
  isStandalone,
  mustInstall,
} from "./lib/install"
import { mount } from "svelte"

// The dev server skips the gate, so the card can be worked on in a browser tab.
const gated =
  !import.meta.env.DEV && mustInstall(detectPlatform(currentDevice()), isStandalone())

const app = mount(gated ? InstallGate : App, {
  target: document.getElementById("app")!,
})

export default app
