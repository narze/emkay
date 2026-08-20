<script lang="ts">
  import logo from "./assets/logo.png"
</script>

<main class="under-construction">
  <img src={logo} alt="MK Restaurant Logo" class="brand-logo" />
  <h1>อยู่ระหว่างปรับปรุง</h1>
  <p class="subtitle">Under Construction</p>
  <p class="detail">ขออภัยในความไม่สะดวก เว็บไซต์กำลังปรับปรุง</p>
</main>

<style>
  .under-construction {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 2rem;
    font-family:
      Inter,
      system-ui,
      Avenir,
      Helvetica,
      Arial,
      sans-serif;
    color: #333;
  }

  .brand-logo {
    width: 100px;
    height: auto;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
    color: #e51c23;
  }

  .subtitle {
    font-size: 1rem;
    color: #737373;
    margin: 0 0 1.5rem;
  }

  .detail {
    font-size: 0.95rem;
    color: #555;
    margin: 0;
  }
</style>
