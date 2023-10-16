<script lang="ts">
  import cardBlack from "../assets/card_black.jpg"
  import cardBackside from "../assets/card_backside.png"
  import duckJump from "../assets/duck_jump.gif"
  import CanvasCircularCountdown from "canvas-circular-countdown"
  import { onMount } from "svelte"

  let countdown: HTMLElement

  function flip() {
    const card = document.querySelector(".flip-card")
    card.classList.toggle("flipped")
  }

  //             function clockTimeD() {
  //               var d = new Date()
  //               var m = d.getMinutes()
  //               var h = d.getHours()
  //               document.getElementById(
  //                 "clock-d-" + 5555555555555555
  //               ).textContent =
  //                 ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2)
  //             }

  onMount(() => {
    const ct = new CanvasCircularCountdown(countdown, {
      duration: 100 * 1000,
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
    })

    ct.start()

    // setInterval(clockTimeD, 1000)

    // ct[5555555555555555] = new CanvasCircularCountdown(
    //               document.getElementById(
    //                 "countdown-canvas-" + 5555555555555555
    //               ),
    //               {
    //                 duration: 100 * 1000,
    //                 radius: 40,
    //                 progressBarWidth: 10,
    //                 progressBarOffset: 0,
    //                 circleBackgroundColor: "#fbd2d3",
    //                 emptyProgressBarBackgroundColor: "#b9c1c7",
    //                 filledProgressBarBackgroundColor: pickColorByPercentage,
    //                 captionColor: pickColorByPercentage,
    //                 captionFont: "22px serif",
    //                 showCaption: true,
    //                 captionText: pickTime,
    //               },
    //               (percentage, time, instance) => {
    //                 if (time.elapsed >= 5000) {
    //                 }
    //               }
    //             )
    //             var clockd = document.getElementById(
    //               "clock-d-" + 5555555555555555
    //             )
    //             function clockTimeD() {
    //               var d = new Date()
    //               var m = d.getMinutes()
    //               var h = d.getHours()
    //               document.getElementById(
    //                 "clock-d-" + 5555555555555555
    //               ).textContent =
    //                 ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2)
    //             }

    //             setInterval(clockTimeD, 1000)
  })

  const pickTime = (percentage, time) => {
    var seconds = (time.remaining / 1000).toFixed(0)
    return seconds
  }
  const pickColorByPercentage = (percentage, time) => {
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

<div class="flip-card" name="5555555555555555" on:click={flip}>
  <div class="flip-card-inner">
    <div class="flip-card-front">
      <div class="avatar mx-auto">
        <img src={cardBlack} class="img-fluid" />
      </div>
    </div>
    <div class="flip-card-back">
      <div class="avatar mx-auto back-card">
        <img src={cardBackside} class="img-fluid" />

        <div class="d-none d-md-block">
          <div class="row" style="position: relative;bottom: 270px;">
            <div class="col-6">
              <!--?xml version="1.0" encoding="UTF-8"?-->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="150"
                height="150"
                viewBox="0 0 150 150"
                ><rect x="0" y="0" width="150" height="150" fill="#ffffff" /><g
                  transform="scale(5.172)"
                  ><g transform="translate(0,0)"
                    ><path
                      fill-rule="evenodd"
                      d="M9 0L9 1L8 1L8 2L9 2L9 3L8 3L8 4L10 4L10 7L11 7L11 4L12 4L12 5L14 5L14 8L13 8L13 9L11 9L11 8L6 8L6 9L5 9L5 8L0 8L0 9L1 9L1 10L0 10L0 11L1 11L1 12L0 12L0 13L1 13L1 12L2 12L2 14L0 14L0 15L1 15L1 16L2 16L2 15L3 15L3 17L2 17L2 19L3 19L3 18L6 18L6 19L7 19L7 20L6 20L6 21L8 21L8 23L11 23L11 24L13 24L13 25L10 25L10 24L8 24L8 29L9 29L9 26L12 26L12 27L11 27L11 29L12 29L12 28L13 28L13 29L14 29L14 28L16 28L16 29L18 29L18 28L24 28L24 29L27 29L27 28L28 28L28 26L29 26L29 25L28 25L28 24L25 24L25 23L26 23L26 21L27 21L27 20L25 20L25 17L27 17L27 16L28 16L28 18L29 18L29 16L28 16L28 14L29 14L29 13L28 13L28 14L26 14L26 15L27 15L27 16L25 16L25 13L27 13L27 12L25 12L25 9L26 9L26 8L25 8L25 9L24 9L24 8L23 8L23 9L22 9L22 8L20 8L20 9L19 9L19 8L17 8L17 5L20 5L20 4L21 4L21 3L20 3L20 2L19 2L19 1L20 1L20 0L19 0L19 1L15 1L15 0L14 0L14 1L15 1L15 4L17 4L17 5L14 5L14 3L12 3L12 2L13 2L13 1L11 1L11 2L10 2L10 0ZM16 2L16 3L19 3L19 4L20 4L20 3L19 3L19 2ZM10 3L10 4L11 4L11 3ZM8 5L8 7L9 7L9 5ZM12 6L12 7L13 7L13 6ZM15 6L15 7L16 7L16 6ZM18 6L18 7L19 7L19 6ZM20 6L20 7L21 7L21 6ZM14 8L14 9L13 9L13 12L12 12L12 10L11 10L11 9L10 9L10 11L11 11L11 12L10 12L10 13L13 13L13 14L14 14L14 13L15 13L15 14L16 14L16 15L13 15L13 16L12 16L12 17L13 17L13 20L12 20L12 18L11 18L11 19L9 19L9 20L8 20L8 21L9 21L9 20L12 20L12 21L13 21L13 24L14 24L14 25L13 25L13 28L14 28L14 27L15 27L15 26L16 26L16 27L17 27L17 28L18 28L18 26L19 26L19 27L20 27L20 26L21 26L21 27L22 27L22 26L23 26L23 27L24 27L24 26L25 26L25 28L27 28L27 27L26 27L26 26L28 26L28 25L24 25L24 26L23 26L23 25L22 25L22 26L21 26L21 25L20 25L20 23L17 23L17 22L19 22L19 21L20 21L20 20L22 20L22 19L23 19L23 20L24 20L24 19L23 19L23 18L24 18L24 17L25 17L25 16L24 16L24 13L25 13L25 12L24 12L24 13L23 13L23 12L22 12L22 11L23 11L23 10L24 10L24 9L23 9L23 10L22 10L22 9L20 9L20 10L19 10L19 9L17 9L17 8ZM27 8L27 9L28 9L28 10L26 10L26 11L28 11L28 10L29 10L29 9L28 9L28 8ZM2 9L2 10L5 10L5 9ZM6 9L6 10L8 10L8 11L9 11L9 9ZM14 9L14 10L15 10L15 11L14 11L14 12L13 12L13 13L14 13L14 12L15 12L15 13L19 13L19 14L18 14L18 15L19 15L19 14L20 14L20 13L22 13L22 14L21 14L21 15L20 15L20 16L15 16L15 17L17 17L17 18L20 18L20 19L22 19L22 18L23 18L23 17L24 17L24 16L23 16L23 17L22 17L22 15L23 15L23 13L22 13L22 12L20 12L20 11L19 11L19 10L18 10L18 11L19 11L19 12L15 12L15 11L17 11L17 10L15 10L15 9ZM21 10L21 11L22 11L22 10ZM2 11L2 12L4 12L4 14L7 14L7 13L8 13L8 14L9 14L9 15L6 15L6 16L8 16L8 17L6 17L6 18L7 18L7 19L8 19L8 17L9 17L9 18L10 18L10 17L11 17L11 15L12 15L12 14L9 14L9 12L7 12L7 11ZM6 12L6 13L7 13L7 12ZM19 12L19 13L20 13L20 12ZM4 15L4 17L5 17L5 15ZM9 16L9 17L10 17L10 16ZM13 16L13 17L14 17L14 16ZM0 17L0 21L1 21L1 17ZM21 17L21 18L22 18L22 17ZM15 18L15 21L14 21L14 20L13 20L13 21L14 21L14 22L15 22L15 23L14 23L14 24L15 24L15 25L14 25L14 26L15 26L15 25L19 25L19 26L20 26L20 25L19 25L19 24L15 24L15 23L16 23L16 22L15 22L15 21L19 21L19 20L16 20L16 18ZM26 18L26 19L27 19L27 18ZM4 19L4 20L5 20L5 19ZM28 19L28 20L29 20L29 19ZM21 21L21 24L24 24L24 21ZM11 22L11 23L12 23L12 22ZM22 22L22 23L23 23L23 22ZM0 0L0 7L7 7L7 0ZM1 1L1 6L6 6L6 1ZM2 2L2 5L5 5L5 2ZM22 0L22 7L29 7L29 0ZM23 1L23 6L28 6L28 1ZM24 2L24 5L27 5L27 2ZM0 22L0 29L7 29L7 22ZM1 23L1 28L6 28L6 23ZM2 24L2 27L5 27L5 24Z"
                      fill="#000000"
                    /></g
                  ></g
                ></svg
              >
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-4 mt-5">
                  <img src={duckJump} width="120" />
                </div>
              </div>
              <div
                class="timecout-d"
                name="d-5555555555555555"
                id="countdown-canvas-5555555555555555"
                bind:this={countdown}
              >
                <canvas
                  width="160"
                  height="160"
                  style="width: 80px; height: 80px;"
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6">5555555555555555</div>
            </div>
            <div class="row">
              <div
                class="col-12 text-center"
                style="position: absolute;bottom: -40px;font-size:14px;"
              >
                ไม่รับ QR Code ที่ได้มาจากการ Screen Capture
              </div>
              <div class="text-end" style="position: relative;bottom: -10px;">
                <span id="clock-d-5555555555555555">13:31</span>
                <span>16/10/2023</span>
              </div>
            </div>
          </div>
        </div>

        <div class="d-block d-md-none">
          <div class="row" style="position: relative;bottom: 140px;">
            <div class="col-5 offset-1">
              <!--?xml version="1.0" encoding="UTF-8"?-->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="80"
                height="80"
                viewBox="0 0 80 80"
                ><rect x="0" y="0" width="80" height="80" fill="#ffffff" /><g
                  transform="scale(2.759)"
                  ><g transform="translate(0,0)"
                    ><path
                      fill-rule="evenodd"
                      d="M9 0L9 1L8 1L8 2L9 2L9 3L8 3L8 4L10 4L10 7L11 7L11 4L12 4L12 5L14 5L14 8L13 8L13 9L11 9L11 8L6 8L6 9L5 9L5 8L0 8L0 9L1 9L1 10L0 10L0 11L1 11L1 12L0 12L0 13L1 13L1 12L2 12L2 14L0 14L0 15L1 15L1 16L2 16L2 15L3 15L3 17L2 17L2 19L3 19L3 18L6 18L6 19L7 19L7 20L6 20L6 21L8 21L8 23L11 23L11 24L13 24L13 25L10 25L10 24L8 24L8 29L9 29L9 26L12 26L12 27L11 27L11 29L12 29L12 28L13 28L13 29L14 29L14 28L16 28L16 29L18 29L18 28L24 28L24 29L27 29L27 28L28 28L28 26L29 26L29 25L28 25L28 24L25 24L25 23L26 23L26 21L27 21L27 20L25 20L25 17L27 17L27 16L28 16L28 18L29 18L29 16L28 16L28 14L29 14L29 13L28 13L28 14L26 14L26 15L27 15L27 16L25 16L25 13L27 13L27 12L25 12L25 9L26 9L26 8L25 8L25 9L24 9L24 8L23 8L23 9L22 9L22 8L20 8L20 9L19 9L19 8L17 8L17 5L20 5L20 4L21 4L21 3L20 3L20 2L19 2L19 1L20 1L20 0L19 0L19 1L15 1L15 0L14 0L14 1L15 1L15 4L17 4L17 5L14 5L14 3L12 3L12 2L13 2L13 1L11 1L11 2L10 2L10 0ZM16 2L16 3L19 3L19 4L20 4L20 3L19 3L19 2ZM10 3L10 4L11 4L11 3ZM8 5L8 7L9 7L9 5ZM12 6L12 7L13 7L13 6ZM15 6L15 7L16 7L16 6ZM18 6L18 7L19 7L19 6ZM20 6L20 7L21 7L21 6ZM14 8L14 9L13 9L13 12L12 12L12 10L11 10L11 9L10 9L10 11L11 11L11 12L10 12L10 13L13 13L13 14L14 14L14 13L15 13L15 14L16 14L16 15L13 15L13 16L12 16L12 17L13 17L13 20L12 20L12 18L11 18L11 19L9 19L9 20L8 20L8 21L9 21L9 20L12 20L12 21L13 21L13 24L14 24L14 25L13 25L13 28L14 28L14 27L15 27L15 26L16 26L16 27L17 27L17 28L18 28L18 26L19 26L19 27L20 27L20 26L21 26L21 27L22 27L22 26L23 26L23 27L24 27L24 26L25 26L25 28L27 28L27 27L26 27L26 26L28 26L28 25L24 25L24 26L23 26L23 25L22 25L22 26L21 26L21 25L20 25L20 23L17 23L17 22L19 22L19 21L20 21L20 20L22 20L22 19L23 19L23 20L24 20L24 19L23 19L23 18L24 18L24 17L25 17L25 16L24 16L24 13L25 13L25 12L24 12L24 13L23 13L23 12L22 12L22 11L23 11L23 10L24 10L24 9L23 9L23 10L22 10L22 9L20 9L20 10L19 10L19 9L17 9L17 8ZM27 8L27 9L28 9L28 10L26 10L26 11L28 11L28 10L29 10L29 9L28 9L28 8ZM2 9L2 10L5 10L5 9ZM6 9L6 10L8 10L8 11L9 11L9 9ZM14 9L14 10L15 10L15 11L14 11L14 12L13 12L13 13L14 13L14 12L15 12L15 13L19 13L19 14L18 14L18 15L19 15L19 14L20 14L20 13L22 13L22 14L21 14L21 15L20 15L20 16L15 16L15 17L17 17L17 18L20 18L20 19L22 19L22 18L23 18L23 17L24 17L24 16L23 16L23 17L22 17L22 15L23 15L23 13L22 13L22 12L20 12L20 11L19 11L19 10L18 10L18 11L19 11L19 12L15 12L15 11L17 11L17 10L15 10L15 9ZM21 10L21 11L22 11L22 10ZM2 11L2 12L4 12L4 14L7 14L7 13L8 13L8 14L9 14L9 15L6 15L6 16L8 16L8 17L6 17L6 18L7 18L7 19L8 19L8 17L9 17L9 18L10 18L10 17L11 17L11 15L12 15L12 14L9 14L9 12L7 12L7 11ZM6 12L6 13L7 13L7 12ZM19 12L19 13L20 13L20 12ZM4 15L4 17L5 17L5 15ZM9 16L9 17L10 17L10 16ZM13 16L13 17L14 17L14 16ZM0 17L0 21L1 21L1 17ZM21 17L21 18L22 18L22 17ZM15 18L15 21L14 21L14 20L13 20L13 21L14 21L14 22L15 22L15 23L14 23L14 24L15 24L15 25L14 25L14 26L15 26L15 25L19 25L19 26L20 26L20 25L19 25L19 24L15 24L15 23L16 23L16 22L15 22L15 21L19 21L19 20L16 20L16 18ZM26 18L26 19L27 19L27 18ZM4 19L4 20L5 20L5 19ZM28 19L28 20L29 20L29 19ZM21 21L21 24L24 24L24 21ZM11 22L11 23L12 23L12 22ZM22 22L22 23L23 23L23 22ZM0 0L0 7L7 7L7 0ZM1 1L1 6L6 6L6 1ZM2 2L2 5L5 5L5 2ZM22 0L22 7L29 7L29 0ZM23 1L23 6L28 6L28 1ZM24 2L24 5L27 5L27 2ZM0 22L0 29L7 29L7 22ZM1 23L1 28L6 28L6 23ZM2 24L2 27L5 27L5 24Z"
                      fill="#000000"
                    /></g
                  ></g
                ></svg
              >
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-5 mt-2">
                  <img src={duckJump} width="80" />
                </div>
              </div>
              <div
                class="timecout-m"
                name="m-5555555555555555"
                id="countdown-canvas-mb-5555555555555555"
              >
                <canvas
                  width="80"
                  height="80"
                  style="width: 40px; height: 40px;"
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-8" style="font-size:0.7rem;">
                5555555555555555
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
                <span id="clock-m-5555555555555555">13:31</span>
                <span>16/10/2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
