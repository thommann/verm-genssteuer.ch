<script setup>
// Datenschutzerklärung: deckt den Mindestinhalt nach Art. 19 des revidierten
// DSG ab (Verantwortlicher, Zweck, Empfänger, Bekanntgabe ins Ausland,
// Betroffenenrechte). Die Website ist statisch, ohne Cookies und Tracking.
</script>

<template>
  <section
    id="datenschutz"
    class="section-alt legal"
  >
    <div class="wrap">
      <div class="eyebrow">
        {{ $t('datenschutz.eyebrow') }}
      </div>
      <h2>{{ $t('datenschutz.title') }}</h2>
      <p class="lead">
        {{ $t('datenschutz.lead') }}
      </p>
      <p class="muted legal-updated">
        {{ $t('datenschutz.updated') }}
      </p>

      <div class="card legal-block">
        <h3>{{ $t('datenschutz.controllerTitle') }}</h3>
        <p v-html="$t('datenschutz.controllerBody')" />
      </div>

      <div class="card legal-block">
        <h3>{{ $t('datenschutz.scopeTitle') }}</h3>
        <p v-html="$t('datenschutz.scopeBody')" />
      </div>

      <div class="card legal-block">
        <h3>{{ $t('datenschutz.logsTitle') }}</h3>
        <p v-html="$t('datenschutz.logsIntro')" />
        <ul>
          <li>{{ $t('datenschutz.logsLi1') }}</li>
          <li>{{ $t('datenschutz.logsLi2') }}</li>
          <li>{{ $t('datenschutz.logsLi3') }}</li>
          <li>{{ $t('datenschutz.logsLi4') }}</li>
        </ul>
        <p class="legal-kv">
          <span class="legal-label">{{ $t('datenschutz.logsPurposeLabel') }}</span>
          <span v-html="$t('datenschutz.logsPurpose')" />
        </p>
        <p class="legal-kv">
          <span class="legal-label">{{ $t('datenschutz.logsRecipientLabel') }}</span>
          <span v-html="$t('datenschutz.logsRecipient')" />
        </p>
      </div>

      <div class="card legal-block">
        <h3>{{ $t('datenschutz.abroadTitle') }}</h3>
        <p v-html="$t('datenschutz.abroadBody')" />
      </div>

      <div class="card legal-block">
        <h3>{{ $t('datenschutz.cookiesTitle') }}</h3>
        <p v-html="$t('datenschutz.cookiesBody')" />
      </div>

      <div class="card legal-block">
        <h3>{{ $t('datenschutz.linksTitle') }}</h3>
        <p v-html="$t('datenschutz.linksBody')" />
      </div>

      <div class="card legal-block">
        <h3>{{ $t('datenschutz.rightsTitle') }}</h3>
        <p v-html="$t('datenschutz.rightsBody')" />
      </div>

      <div class="card legal-block">
        <h3>{{ $t('datenschutz.changesTitle') }}</h3>
        <p v-html="$t('datenschutz.changesBody')" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.legal-updated { margin: 8px 0 0; font-size: 0.85rem; }
.legal-block:first-of-type { margin-top: 28px; }
.legal-block ul { margin: 12px 0; padding-left: 20px; color: var(--text-soft); max-width: 75ch; }
.legal-block li { margin-bottom: 7px; font-size: 0.92rem; }
.legal-kv { display: flex; gap: 10px; margin-top: 12px; }
.legal-label { min-width: 84px; flex: none; font-weight: 700; }
</style>
