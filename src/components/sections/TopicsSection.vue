<script setup>
// Themen-Hub auf der Startseite: drei Karten, die je ein Thema kurz erklären und
// auf die zugehörige Themenseite führen. Die «Enthält»-Tags verlinken direkt auf
// die einzelnen Abschnitte (Anker = nav.items-Schlüssel) der jeweiligen Seite.
const TOPICS = [
  {
    tone: 'gold',
    num: 'topics.card1Num',
    kicker: 'topics.card1Kicker',
    title: 'topics.card1Title',
    text: 'topics.card1Text',
    link: 'topics.card1Link',
    route: '/verteilung',
    subs: ['verteilung', 'international', 'ubs-studie', 'pauschal'],
  },
  {
    tone: 'accent',
    num: 'topics.card2Num',
    kicker: 'topics.card2Kicker',
    title: 'topics.card2Title',
    text: 'topics.card2Text',
    link: 'topics.card2Link',
    route: '/rechner',
    subs: ['rechner', 'dynamik', 'verwendung'],
  },
  {
    tone: 'violet',
    num: 'topics.card3Num',
    kicker: 'topics.card3Kicker',
    title: 'topics.card3Title',
    text: 'topics.card3Text',
    link: 'topics.card3Link',
    route: '/modelle',
    subs: ['wir-reports', 'zucman'],
  },
];
</script>

<template>
  <section id="themen" class="section">
    <div class="wrap">
      <div class="eyebrow">{{ $t('topics.eyebrow') }}</div>
      <h2>{{ $t('topics.title') }}</h2>
      <p class="lead">{{ $t('topics.lead') }}</p>

      <div class="topic-grid">
        <article v-for="topic in TOPICS" :key="topic.route" class="topic card" :class="`tone-${topic.tone}`">
          <div class="topic-kicker">
            <span class="topic-num">{{ $t(topic.num) }}</span>
            <span>{{ $t(topic.kicker) }}</span>
          </div>
          <h3 class="topic-title">{{ $t(topic.title) }}</h3>
          <p class="topic-text">{{ $t(topic.text) }}</p>

          <div class="topic-contains">
            <span class="topic-contains-lab">{{ $t('topics.contains') }}</span>
            <span class="topic-tags">
              <router-link
                v-for="sub in topic.subs"
                :key="sub"
                :to="{ path: topic.route, hash: `#${sub}` }"
                class="topic-tag"
              >
                {{ $t(`nav.items.${sub}`) }}
              </router-link>
            </span>
          </div>

          <router-link :to="topic.route" class="topic-go">
            {{ $t(topic.link) }} <span aria-hidden="true">→</span>
          </router-link>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
  margin-top: 34px;
}
.topic {
  display: flex;
  flex-direction: column;
  padding: 26px 24px 22px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
/* Akzentlinie am oberen Rand je Thema. */
.topic::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--tone);
  opacity: 0.85;
}
.tone-gold { --tone: var(--gold); }
.tone-accent { --tone: var(--accent); }
.tone-violet { --tone: var(--violet); }
.topic:hover { transform: translateY(-3px); border-color: var(--tone); }

.topic-kicker {
  display: flex; align-items: center; gap: 11px;
  text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; font-weight: 700;
  color: var(--text-mute);
  margin-bottom: 14px;
}
.topic-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 9px;
  font-size: 0.95rem; font-weight: 800; letter-spacing: 0;
  color: #11152b; background: var(--tone);
}
.topic-title { font-size: 1.28rem; margin-bottom: 10px; }
.topic-text { color: var(--text-soft); font-size: 0.94rem; margin-bottom: 18px; }

.topic-contains {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.topic-contains-lab {
  display: block;
  font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;
  color: var(--text-mute); margin-bottom: 9px;
}
.topic-tags { display: flex; flex-wrap: wrap; gap: 7px; }
.topic-tag {
  font-size: 0.78rem; font-weight: 600; color: var(--text-soft);
  padding: 4px 11px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border);
  text-decoration: none;
}
.topic-tag:hover { color: var(--text); border-color: var(--tone); text-decoration: none; }

.topic-go {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 18px;
  font-weight: 700; font-size: 0.92rem; color: var(--text);
  text-decoration: none;
}
.topic-go span { color: var(--tone); transition: transform 0.15s ease; display: inline-block; }
.topic-go:hover { text-decoration: none; }
.topic-go:hover span { transform: translateX(4px); }
</style>
