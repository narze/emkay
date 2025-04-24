<script lang="ts">
  import logo from "./assets/logo.png"
  import upDiamond from "./assets/up_diamond.png"
  import Card from "./lib/Card.svelte"
  import bg from "./assets/bg.png"
  import data from "../../scraper/data.json"
  import format from "date-fns/format"
  import formatDistance from "date-fns/formatDistance"
  import { onMount } from "svelte"

  const {
    acc_points,
    redeemable_points,
    card_number,
    expire_date,
    name,
    today_points,
    updated_at,
  } = data

  const expire_date_display = format(new Date(expire_date), "dd/MM/yyyy")
  const progress = Math.min(Math.round((acc_points / 1200) * 100), 100)
  let hide = $state(false)

  function showData() {
    alert(JSON.stringify(data, null, 2))
  }

  onMount(() => {
    if (false && window.location.href.match(/emkay\.vercel/)) {
      hide = true
      alert("ย้ายเว็บแล้ว โปรดถามใน Facebook Messenger นะจ๊ะ")
      window.location.href = "https://m.me/narze?text=ขอเว็บ%20emkay%20ใหม่"
    } else {
      motd()
    }
  })

  function motd() {
    const key = "emkay-motd"

    let currentDate = new Date().toDateString()

    let lastAlertDate = localStorage.getItem(key)

    if (lastAlertDate !== currentDate) {
      const message = [
        "วิธีใช้งาน",
        "1. คลิกที่บัตรสมาชิก",
        "2. โชว์ QR Code ให้พนักงานสแกน",
        "3. รับส่วนลด",
      ].join("\n")

      localStorage.setItem(key, currentDate)

      setTimeout(() => {
        alert(message)
      }, 1000)
    }
  }
</script>

{#if !hide}
  <main class="stretched bg-white">
    <header>
      <nav
        class="navbar navbar-light bg-white fixed-top navbar-expand-md bottom-shadow"
      >
        <div class="container-fluid">
          <a class="navbar-brand" href="#" style="color: gray">
            e<img src={logo} alt="Logo" width="80" height="60" />ay
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasNavbarLabel"></h5>
              <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
></button>
            </div>
            <div class="offcanvas-body">
              <ul
                class="navbar-nav justify-content-end flex-grow-1 pe-3 text-center"
              >
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#th/home"
                    >หน้าแรก</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#th/profile">ข้อมูลส่วนตัว</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#th/order-history"
                    >ประวัติการซื้อบัตรสมาชิก</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#th/change-password"
                    >เปลี่ยนรหัสผ่าน</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    href="https://www.mkrestaurant.com/th/card"
                    target="_blank">ประเภทบัตรสมาชิก MK</a
                  >
                </li>

                <li class="nav-item d-block d-sm-none d-sm-block d-md-none">
                  <a class="nav-link" aria-current="page" href="#th/contact"
                    >ติดต่อเรา</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" href="#th/logout"
                    >ลงชื่อออก</a
                  >
                  <form
                    id="logout-form"
                    action="#th/logout"
                    method="POST"
                    class="d-none"
                  >
                    <input
                      type="hidden"
                      name="_token"
                      value="s1FyH3i7F6g5zr8Hm7BLw63SRJUqZO28TCi7ZMTC"
                    />
                  </form>
                </li>

                <li
                  class="nav-item d-block d-sm-none d-sm-block d-md-none d-flex justify-content-center py-5"
                >
                  <div class="col-2">
                    <hr style="height: 2px; margin:0px;" />
                  </div>
                </li>

                <li class="nav-item d-block d-sm-none d-sm-block d-md-none">
                  <span class="nav-link">
                    <a aria-current="page" href="#th/home">TH</a>
                    |
                    <a aria-current="page" href="#en/home">EN</a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <div
        class="container-fluid pt-5 pb-1"
        id="main"
        style={`background-image: url(${bg}); background-repeat: repeat;`}
      >
        <div class="row justify-content-center pt-5">
          <div class="col-12 pt-2">
            <div
              id="carouselCard"
              class="carousel slide pointer-event"
              data-bs-ride="carousel"
              data-bs-interval="false"
            >
              <div class="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselCard"
                  data-bs-slide-to="0"
                  class="active"
                  aria-current="true"
                  aria-label="Slide 1"
></button>
                <button
                  type="button"
                  data-bs-target="#carouselCard"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
></button>
              </div>
              <div class="carousel-inner">
                <div class="carousel-item w-100 active">
                  <div class="row text-center">
                    <div class="area1"></div>
                    <div class="card loginfm shadow-sm card-radius" id="card">
                      <Card />
                      <div>
                        <div class="card-body">
                          <div>
                            <h6>คลิกที่บัตรสมาชิกเพื่อสแกนบัตร</h6>
                          </div>

                          <div class="row d-flex justify-content-center mt-2">
                            <div class="col-md-3 col-10">
                              <hr />
                            </div>
                          </div>

                          <div class="row d-flex justify-content-center mt-1">
                            <div class="col-12" style="font-size:12px;">
                              <label>MAINTAIN</label>
                            </div>
                            <div class="col-12">
                              <h6 class="fw-bold">MK DIAMOND CARD</h6>
                            </div>

                            <div
                              class="row g-1 d-flex justify-content-center"
                              style="margin-top:-12px;"
                            >
                              <div
                                class="col-7 col-md-4 col-lg-3 col-xl-2 my-auto"
                              >
                                <div
                                  class="progress"
                                  style="height: 10px;background-color: #c2c2c2;"
                                >
                                  <div
                                    class="progress-bar bg-danger"
                                    role="progressbar"
                                    style={`width: ${progress}%;`}
                                    aria-valuenow={progress}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >
                                    {progress}%
                                  </div>
                                </div>
                              </div>
                              <div class="col-auto">
                                <img src={upDiamond} width="80" />
                              </div>
                            </div>
                          </div>

                          <div
                            class="row d-flex justify-content-center"
                            style="margin-top:-10px;"
                          >
                            <div style="font-size: 15px;">
                              คะแนนปรับระดับสะสม <span
                                class="txt-red"
                                style="font-size: 20px;">{(acc_points ?? 0).toLocaleString()}</span
                              >/1,200 คะแนน
                            </div>
                            <span style="font-size: 10px;">
                              สะสมภายใน {expire_date_display}</span
                            >
                          </div>
                          <div class="row d-flex justify-content-center">
                            <div class="col-md-3 col-10">
                              <hr />
                            </div>
                          </div>

                          <div class="mt-2">
                            <h4>{name}</h4>
                          </div>
                          <ul class="list-inline mt-3">
                            <li class="list-inline-item p-divider">
                              <a href="#my-coupon" class="h5 text-success"
                                >คูปองของฉัน
                              </a>
                            </li>
                            <li class="list-inline-item">
                              <a href="#redeem" class="h5 text-success"
                                >แลกคะแนนสะสม
                              </a>
                            </li>
                          </ul>

                          <div
                            class="mx-auto detail-profile"
                            style="width: 20rem; font-size:13px;"
                          >
                            <div class="text-start mx-1 my-2">
                              <div style="margin-left:8px;">
                                หมายเลขบัตรสมาชิก: <span class="txt-red">
                                  {card_number}
                                </span>
                              </div>
                              <div style="margin-left:8px;">
                                บัตรสมาชิกหมดอายุ: <span class="txt-red">
                                  {expire_date_display}
                                </span>
                              </div>
                              <div style="margin-left:8px;">
                                คะแนนสะสมวันนี้: <span class="txt-red">
                                  {today_points}
                                </span> คะแนน
                              </div>
                              <div style="margin-left:8px;">
                                คะแนนแลกของรางวัล: <span class="txt-red">
                                  {redeemable_points}
                                </span> คะแนน
                              </div>
                              <div style="margin-left:8px;color: #737373;">
                                วันหมดอายุ (คะแนนแลกของรางวัล):
                                <div class="ms-5">
                                  {redeemable_points} คะแนน หมดอายุ - 30/12/2023
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            class="row d-flex justify-content-center g-2 mt-2 mb-4"
                          >
                            <a
                              class="btn btn-back"
                              href="#profile"
                              style="margin-right: 5px;"
                            >
                              แก้ไขข้อมูลส่วนตัว
                            </a>
                            <button
                              class="btn btn-back history"
                              style="margin-right: 5px;"
                              onclick={showData}
                            >
                              ประวัติการใช้งาน
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="carousel-item w-100">
                  <div class="row text-center">
                    <div class="area1"></div>
                    <div class="card loginfm shadow-sm card-radius" id="card">
                      <div class="avatar mx-auto">
                        <a href="#products">
                          <img
                            src="./mymk_files/addnew.png"
                            class="img-fluid"
                          />
                        </a>
                      </div>
                      <div style="height:500px;"></div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#carouselCard"
                data-bs-slide="prev"
              >
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#carouselCard"
                data-bs-slide="next"
              >
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
            <!-- End carouselCard-->
          </div>
        </div>
        <div id="history"></div>
      </div>
    </main>
    <footer class="footer mt-auto pb-2">
      <div class="d-flex justify-content-center">
        <div class="col-9 col-md-6 col-lg-6 col-xl-6 col-xxl-5">
          <hr style="height: 2px; margin:0px;" />
        </div>
      </div>
      <div class="container">
        <div class="footer-font">
          <div class="d-flex justify-content-center mt-2">
            <label>ติดต่อ MK Call Center 02-066-1000</label>
          </div>
          <div class="d-flex justify-content-center mt-1">
            <label>จันทร์-ศุกร์: 08:00-21.00 น.</label>
          </div>
          <div class="d-flex justify-content-center mt-1">
            <label>เสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์: 10:00-21.00 น.</label>
          </div>
          <div class="row text-center">
            <div class="col-12 mt-1">
              <a href="#term-conditions" target="_blank"
                >ข้อกำหนดและเงื่อนไขสำหรับเว็บไซต์</a
              >
            </div>
            <div class="col-12 mt-1">
              <a
                href="https://docs.t-reg.co/b1061f38-6502-475e-9f48-f860b508c63a/PrvNtc/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%95%E0%B8%B1%E0%B8%A7.pdf"
                target="_blank">ประกาศความเป็นส่วนตัว</a
              >
            </div>
            <div class="col-12 mt-1">
              <a
                href="https://docs.t-reg.co/b1061f38-6502-475e-9f48-f860b508c63a/PrvNtc/%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%84%E0%B8%B8%E0%B8%81%E0%B8%81%E0%B8%B5%E0%B9%89.pdf"
                target="_blank">นโยบายการใช้คุกกี้</a
              > &nbsp;&nbsp;
            </div>
            <div class="col-12 mt-1">
              <a href="#DataAccessRequest"
                >แบบฟอร์มการขอใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล</a
              >
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center mt-2 gap-2 text-muted">
          <span
            ><a
              href="https://github.com/narze/emkay/blob/main/scraper/data.json"
              class="text-muted">data.json</a
            >
            updated at {format(new Date(updated_at), "HH:mm dd/MM/yyyy")} ({formatDistance(
              new Date(updated_at),
              new Date(),
              {
                addSuffix: true,
              }
            )})</span
          >
        </div>
      </div>
    </footer>
  </main>
{/if}
