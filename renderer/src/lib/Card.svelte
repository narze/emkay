<script lang="ts">
  import CanvasCircularCountdown from "canvas-circular-countdown"
  import { onMount } from "svelte"
  import QRCode from "qrcode"
  import { format } from "date-fns"

  import cardBlack from "../assets/card_black.jpg"
  import cardDiamond from "../assets/card_diamond.jpg"
  import cardBackside from "../assets/card_backside.png"
  import duckJump from "../assets/duck_jump.gif"
  import data from "../../../scraper/data.json"

  let countdown = $state<HTMLElement>()
  let countdown2 = $state<HTMLElement>()
  let ct: any, ct2: any
  let timestamp = new Date()

  const { acc_points, card_number, expire_date, name, today_points } = data
  const DURATION = 100

  let timestamp_formatted = $derived(format(timestamp, "yyyy-MM-dd HH:mm:ss"))
  let timestamp_display = $derived(format(timestamp, "HH:mm dd/MM/yyyy"))

  let card_qrcode = $derived(
    `W|${card_number}|${expire_date}|${timestamp_formatted}`
  )

  function flip() {
    const card = document.querySelector(".flip-card")
    if (!card) return

    card.classList.toggle("flipped")

    if (card.classList.contains("flipped")) {
      ct.reset().start()
      ct2.reset().start()
    } else {
      ct.stop()
      ct2.stop()
    }
  }

  function qrcode(
    node: HTMLCanvasElement,
    options: { value: string; size: number }
  ) {
    const { value, size } = options
    QRCode.toCanvas(node, value, {
      margin: 0,
      width: size,
    })
  }

  onMount(() => {
    ct = new CanvasCircularCountdown(
      countdown,
      {
        duration: DURATION * 1000,
        radius: 40,
        progressBarWidth: 10,
        progressBarOffset: 0,
        circleBackgroundColor: "#fbd2d3",
        emptyProgressBarBackgroundColor: "#b9c1c7",
        filledProgressBarBackgroundColor: pickColorByPercentage,
        captionColor: pickColorByPercentage,
        captionFont: "22px serif",
        showCaption: true,
        captionText: pickTime,
      },
      (percentage: number, time: { remaining: number }, instance: any) => {
        // console.log({ percentage, time, instance })

        if (time.remaining <= 100) {
          instance.reset().start()
        }
      }
    )

    ct2 = new CanvasCircularCountdown(
      countdown2,
      {
        duration: DURATION * 1000,
        radius: 20,
        progressBarWidth: 5,
        progressBarOffset: 0,
        circleBackgroundColor: "#fbd2d3",
        emptyProgressBarBackgroundColor: "#b9c1c7",
        filledProgressBarBackgroundColor: pickColorByPercentage,
        captionColor: pickColorByPercentage,
        captionFont: "18px serif",
        showCaption: true,
        captionText: pickTime,
      },
      (percentage: number, time: { remaining: number }, instance: any) => {
        if (time.remaining <= 100) {
          instance.reset().start()
        }
      }
    )
  })

  const pickTime = (
    _percentage: number,
    time: { remaining: number }
  ) => {
    var seconds = (time.remaining / 1000).toFixed(0)
    return seconds
  }
  const pickColorByPercentage = (percentage: number) => {
    switch (true) {
      case percentage >= 75:
        return "#28a745" // green
      case percentage >= 50 && percentage < 75:
        return "#17a2b8" // blue
      case percentage >= 25 && percentage < 50:
        return "#ffc107" // orange
      default:
        return "#dc3545" // red
    }
  }
</script>

<div
  class="flip-card"
  role="button"
  tabindex="0"
  onclick={flip}
  onkeydown={(event) => {
    if (event.key === "Enter" || event.key === " ") flip()
  }}
>
  <div class="flip-card-inner">
    <div class="flip-card-front">
      <div class="avatar mx-auto">
        <img src={cardDiamond} class="img-fluid" alt="Membership card front" />
      </div>
    </div>
    <div class="flip-card-back">
      <div class="avatar mx-auto back-card">
        <img src={cardBackside} class="img-fluid" alt="Membership card back" />

        <div class="d-none d-md-block">
          <div class="row" style="position: relative;bottom: 270px;">
            <div class="col-6">
              <canvas use:qrcode={{ value: card_qrcode, size: 150 }}></canvas>
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-4 mt-5">
                  <img src={duckJump} width="120" alt="" />
                </div>
              </div>
              <div class="timecout-d" bind:this={countdown}>
                <canvas
                  width="160"
                  height="160"
                  style="width: 80px; height: 80px;"
                ></canvas>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6">{card_number}</div>
            </div>
            <div class="row">
              <div
                class="col-12 text-center"
                style="position: absolute;bottom: -40px;font-size:14px;"
              >
                ไม่รับ QR Code ที่ได้มาจากการ Screen Capture
              </div>
              <div class="text-end" style="position: relative;bottom: -10px;">
                <span>{timestamp_display}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="d-block d-md-none">
          <div class="row" style="position: relative;bottom: 140px;">
            <div class="col-5 offset-1" style="height: 80px">
              <canvas use:qrcode={{ value: card_qrcode, size: 80 }}></canvas>
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-5 mt-2">
                  <img src={duckJump} width="80" alt="" />
                </div>
              </div>
              <div class="timecout-m" bind:this={countdown2}>
                <canvas
                  width="80"
                  height="80"
                  style="width: 40px; height: 40px;"
                ></canvas>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-8" style="font-size:0.7rem;">
                {card_number}
              </div>
            </div>
            <div class="row">
              <div
                class="col-12"
                style="position: absolute;bottom: -7px;font-size:10px;"
              >
                ไม่รับ QR Code ที่ได้มาจากการ Screen Capture
              </div>
              <div
                class="text-end"
                style="position: relative;bottom: 5px;font-size:10px;"
              >
                <span>{timestamp_display}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
