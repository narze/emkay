<script lang="ts">
  const groups = [
    { title: "บัญชีของฉัน", items: ["ข้อมูลส่วนตัว", "รวมบัตรสมาชิก"] },
    { title: "ประวัติรายการ", items: ["คะแนน", "วันหมดอายุคะแนน"] },
  ]
</script>

<section class="profile-menu" aria-label="โปรไฟล์">
  <h1>สวัสดี</h1>
  <div class="scan-banner">
    <span class="scan-copy">
      <strong>สแกนสะสมคะแนน</strong>
      <span>จาก QR ท้ายใบเสร็จ</span>
    </span>
    <span class="scan-decoration" aria-hidden="true">
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 27V12a4 4 0 0 1 4-4h15M53 8h15a4 4 0 0 1 4 4v15M72 53v15a4 4 0 0 1-4 4H53M27 72H12a4 4 0 0 1-4-4V53" />
        <path d="M19 19h17v17H19zM46 19h15v17H46zM19 46h17v15H19zM46 46h6v6h9v9H46z" />
      </svg>
    </span>
  </div>

  {#each groups as group}
    <section class="menu-group" aria-label={group.title}>
      <h2>{group.title}</h2>
      {#each group.items as item}
        <div class="menu-row">
          <span>{item}</span><span class="chevron" aria-hidden="true"></span>
        </div>
      {/each}
    </section>
  {/each}

  <section class="menu-group" aria-label="การตั้งค่า">
    <h2>การตั้งค่า</h2>
    <div class="menu-row">
      <span>ภาษา</span>
      <div class="language-toggle" aria-label="ภาษาไทย">
        {#each ["TH", "EN"] as value}
          <span class:selected={value === "TH"}>{value}</span>
        {/each}
      </div>
    </div>
  </section>
</section>
