// import './app.css'
import "./styles/app.css"
import "./styles/mymk.css"
// import "./styles/all.min.css"
// import "./styles/splide.min.css"

import App from "./App.svelte"
import { mount } from "svelte";

const app = mount(App, {
  target: document.getElementById("app"),
})

export default app
