<script setup>
// Impressum: Identifikationsangaben zur verantwortlichen Person. Die Seite ist
// nicht kommerziell, deshalb erfüllen die Angaben freiwillig die
// Identifikationspflicht des DSG statt einer UWG-Impressumspflicht.
</script>

<template>
  <section id="impressum" class="section-alt legal">
    <div class="wrap">
      <div class="eyebrow">{{ $t('impressum.eyebrow') }}</div>
      <h2>{{ $t('impressum.title') }}</h2>
      <p class="lead">{{ $t('impressum.lead') }}</p>

      <div class="legal-grid">
        <div class="card legal-card">
          <h3>{{ $t('impressum.operatorTitle') }}</h3>
          <p class="legal-name">{{ $t('impressum.operatorName') }}</p>
          <p class="muted">{{ $t('impressum.operatorRole') }}</p>
        </div>

        <div class="card legal-card">
          <h3>{{ $t('impressum.contactTitle') }}</h3>
          <p>
            <span class="legal-label">{{ $t('impressum.contactEmailLabel') }}</span>
            <a :href="`mailto:${$t('impressum.contactEmail')}`">{{ $t('impressum.contactEmail') }}</a>
          </p>
        </div>
      </div>

      <div class="card legal-block">
        <h3>{{ $t('impressum.natureTitle') }}</h3>
        <p v-html="$t('impressum.natureBody')" />
      </div>

      <div class="card legal-block">
        <h3>{{ $t('impressum.liabilityTitle') }}</h3>
        <p v-html="$t('impressum.liabilityBody')" />
      </div>

      <p class="muted legal-hint" v-html="$t('impressum.privacyHint')" />
    </div>
  </section>
</template>

<style scoped>
.legal { padding: clamp(40px, 7vw, 88px) 0; }
.legal h2 { margin-bottom: 6px; }
.legal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin: 28px 0 16px; }
.legal-card { padding: 22px; }
.legal-card h3, .legal-block h3 { font-size: 0.95rem; color: var(--text-soft); margin: 0 0 10px; }
.legal-name { font-size: 1.15rem; font-weight: 800; color: var(--text); margin: 0 0 2px; }
.legal-label { display: inline-block; min-width: 64px; color: var(--text-mute); font-size: 0.85rem; }
.legal-block { padding: 24px; margin-top: 16px; }
.legal-block p { max-width: 75ch; color: var(--text-soft); font-size: 0.94rem; line-height: 1.7; }
.legal-hint { margin-top: 22px; font-size: 0.88rem; }
</style>
