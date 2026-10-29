<script lang="ts">
  export let page: "home" | "coupon" | "notifications"
</script>

<section class="loading-page" aria-label="กำลังโหลด" aria-busy="true">
  <span class="sr-only" role="status">กำลังโหลด</span>
  {#if page === "notifications"}
    <h1>แจ้งเตือน</h1>
    <p class="notification-intro">อย่าพลาดการใช้สิทธิพิเศษของคุณ!</p>
    <div class="skeleton-layout notification-skeleton" aria-hidden="true">
      {#each [2, 1, 2] as count, index}
        <div class="notification-group">
          <div class="skeleton skeleton-line" style:width={`${30 + index * 5}%`}></div>
          {#each Array(count) as _}
            <div class="skeleton notification-placeholder" class:tall={index === 1}></div>
          {/each}
        </div>
      {/each}
    </div>
  {:else if page === "coupon"}
    <div class="skeleton-layout coupon-skeleton" aria-hidden="true">
      <div class="skeleton coupon-title"></div>
      <div class="skeleton coupon-subtitle"></div>
      <div class="coupon-tabs">
        <div class="skeleton"></div><div class="skeleton"></div>
      </div>
      <div class="coupon-filters">
        {#each [1, 2, 3, 4] as _}<div class="skeleton"></div>{/each}
      </div>
      <div class="skeleton-shortcuts">
        {#each [1, 2, 3, 4] as _}
          <div><div class="skeleton skeleton-circle"></div><div class="skeleton shortcut-label"></div></div>
        {/each}
      </div>
      {#each [1, 2, 3] as _}<div class="skeleton coupon-placeholder"></div>{/each}
    </div>
  {:else}
    <div class="skeleton-layout home-skeleton" aria-hidden="true">
      <div class="skeleton-shortcuts">
        {#each [1, 2, 3] as _}
          <div><div class="skeleton skeleton-circle"></div><div class="skeleton shortcut-label"></div></div>
        {/each}
      </div>
      <div class="home-summary">
        <div class="skeleton"></div><div class="skeleton skeleton-circle"></div>
      </div>
      <div class="skeleton home-banner"></div>
      <div class="skeleton home-ticket"></div>
      <div class="home-footer"><div class="skeleton"></div><div class="skeleton"></div></div>
      <div class="skeleton coupon-placeholder"></div>
    </div>
  {/if}
</section>
