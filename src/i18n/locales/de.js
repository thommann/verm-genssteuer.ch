// Zentrale Sammlung aller Oberflächentexte (Deutsch, Schweizer Schreibweise).
// Texte mit Inline-Markup (<strong>, <a>, &nbsp; usw.) werden in den Komponenten
// per v-html gerendert; {platzhalter} werden zur Laufzeit mit formatierten Werten
// gefüllt. Es wird kein deutsches Eszett verwendet (immer «ss»).
export default {
  // Seitentitel je Route (Browser-Tab); werden mit nav.brand zusammengesetzt.
  routes: {
    home: 'Das reichste 1 %',
    verteilung: 'Wie ungleich ist die Schweiz?',
    rechner: 'Vermögenssteuer-Rechner',
    modelle: 'Steuermodelle der Forschung',
    quellen: 'Quellen & Methodik',
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
  },

  // Navigation und Abschnitts-Menü (App.vue)
  nav: {
    brand: 'vermögenssteuer.ch',
    cta: 'Ausprobieren',
    menu: 'Menü',
    menuAria: 'Abschnitts-Menü',
    menuTitle: 'Themen & Abschnitte',
    toTop: 'Nach oben',
    // Überschriften der Themengruppen im Menü.
    groups: {
      verteilung: 'Wie ungleich ist die Schweiz?',
      rechner: 'Was bringt eine Steuer?',
      modelle: 'Welche Modelle gibt es?',
      transparenz: 'Transparenz',
    },
    items: {
      start: 'Start',
      verteilung: 'Verteilung',
      rechner: 'Rechner',
      wegzug: 'Wegzug',
      verwendung: 'Verwendung',
      dynamik: 'Dynamik',
      international: 'International',
      'wir-reports': 'WIR-Reports',
      zucman: 'Zucman-Steuer',
      'ubs-studie': 'UBS-Studie',
      pauschal: 'Pauschalbesteuerung',
      quellen: 'Quellen',
    },
  },

  // Kapitel-Überschriften zwischen den Themen (ChapterHeader / calc-suite).
  chapters: {
    verteilungNum: '01',
    verteilungKicker: 'Thema 1 · Die Verteilung',
    verteilungTitle: 'Wie <span class="hl">ungleich</span> ist die Schweiz?',
    verteilungLead: 'Vier Blickwinkel auf dieselbe Konzentration: die ESTV-Steuerdaten, der internationale Trend, die UBS-Studie und die Pauschalbesteuerten, die in keiner Vermögensstatistik auftauchen.',
    rechnerNum: '02',
    rechnerKicker: 'Thema 2 · Der Rechner',
    rechnerTitle: 'Was würde eine <span class="hl">Vermögenssteuer</span> bringen?',
    rechnerLead: 'Stell ein Steuermodell auf das oberste Prozent ein und sieh in Echtzeit, was es einbringt, was davon dauerhaft tragbar ist und wofür das Geld reichen würde.',
    modelleNum: '03',
    modelleKicker: 'Thema 3 · Die Vorbilder',
    modelleTitle: 'Welche Modelle schlägt die <span class="hl">Forschung</span> vor?',
    modelleLead: 'Woher die Modelle stammen: die progressive Staffel des World Inequality Report und die 2-Prozent-Mindeststeuer von Gabriel Zucman.',
  },

  // Rechner-Einheit: Kopf der zusammengehörenden Abschnitte (Rechner, Wegzug, Rendite, Verwendung).
  calcSuite: {
    kicker: 'Interaktiver Rechner',
    step1: 'Modell',
    step2: 'Wegzug',
    step3: 'Rendite',
    step4: 'Verwendung',
  },

  // WegzugSection
  wegzug: {
    eyebrow: 'Das Wegzug-Argument',
    title: 'Was kostet der Wegzug?',
    lead: 'Gegner einer Vermögenssteuer warnen, die Reichen ziehen weg. Simuliere hier, was das konkret bedeutet: wie viele Personen betroffen wären und was nach dem Steuerausfall netto für den Fiskus übrig bliebe.',
  },

  // Hauptaussage der Kampagne (#start, oberstes Band der Aussagen-Section), mit internem
  // Link zur Erklärung. Wird wie die übrigen claims.items.* in ClaimsSection gerendert.
  hero: {
    eyebrow: 'Darum geht es',
    title: 'Der Grund, dass am <span class="hl">Ende des Monats immer weniger übrig</span> bleibt, ist die wachsende Ungleichheit.',
    expand: 'Erklärung',
    explainText: 'Dein Lohn wächst langsamer als Mieten, Prämien und Preise und wird auch noch viel stärker besteuert. Mit deiner Arbeit und deinem Lohn finanzierst du nicht nur unsere Sozialwerke, Schulen und Infrastruktur, sondern auch die Investitionen der Superreichen in Immobilien, Aktien und Staatsanleihen.',
    explain: 'Wie ungleich die Schweiz ist',
  },

  // ClaimsSection: die übrigen Kampagnen-Aussagen unter der Hauptaussage, als volle Aussage-Bänder (gleicher
  // Verlauf wie die zugehörige Instagram-Slide). Je ein verlinkbarer Abschnitt (Anker-id)
  // mit Eyebrow, Aussage und internem Link zur Erklärung (Datenseite + Anker).
  claims: {
    expand: 'Erklärung',
    items: {
      lebensstandard: {
        eyebrow: 'Das Problem',
        text: 'Der Grund für deinen <span class="hl">sinkenden Lebensstandard</span> ist die wachsende Ungleichheit.',
        explainText: 'Die Vermögen der Superreichen wachsen schneller an, als sie ausgegeben werden können. Ihnen bleibt nichts anderes übrig, als immer grössere Summen in Immobilien und Aktien zu investieren. Somit kaufen sie nach und nach das ganze Land und für dich bleibt nichts mehr übrig.',
        link: 'Wie ungleich die Schweiz ist',
      },
      wirtschaft: {
        eyebrow: 'Das Problem',
        text: 'Der Grund für die <span class="hl">schwächelnde Wirtschaft</span> ist die wachsende Ungleichheit.',
        explainText: 'Weil sich das Vermögen bei den Superreichen sammelt, fehlt es bei dir und somit auch in der Wirtschaft. Deine Kaufkraft sinkt, du kannst dir immer weniger leisten und die Wirtschaft kommt immer mehr ins Stocken.',
        link: 'Die Zahlen zur Ungleichheit',
      },
      eigenheim: {
        eyebrow: 'Das Problem',
        text: 'Der Grund, warum du dir wohl <span class="hl">nie ein eigenes Haus</span> leisten kannst, ist die wachsende Ungleichheit.',
        explainText: 'Die Vermögen der Superreichen wachsen schneller, als sie ausgegeben werden können. Ihnen bleibt nichts anderes übrig, als für immer höhere Preise Häuser zu kaufen. Deshalb hast du mit deinem Lohn keine Chance mehr, auf dem Häusermarkt zu konkurrieren.',
        link: 'Der Graben zwischen Median und Durchschnitt',
      },
      krankenkasse: {
        eyebrow: 'Das Problem',
        text: 'Der Grund für die <span class="hl">steigenden Krankenkassenprämien</span> ist die wachsende Ungleichheit.',
        explainText: 'Je mehr Geld du verdienst, desto weniger Krankenkassenprämien zahlst du im Verhältnis. Die Prämienverbilligungen finanzierst du aus deinen Steuern und bekommst wahrscheinlich nicht einmal welche. Deshalb zahlst du jedes Jahr noch mehr.',
        link: 'Prämien aus der Steuer zahlen',
      },
      oev: {
        eyebrow: 'Das Problem',
        text: 'Der Grund für die <span class="hl">überfüllten Züge und Busse</span> ist die wachsende Ungleichheit.',
        explainText: 'Dem Staat fehlt das Geld, um vernünftig in Infrastruktur wie Züge, Trams, Busse, U-Bahnen und Strassen zu investieren. Du bezahlst bereits hohe Steuern auf deinem Lohn, doch da der Staat die Superreichen nicht besteuern kann, muss er dich noch weiter ausquetschen oder die Infrastruktur verlottern lassen.',
        link: 'öV günstiger machen',
      },
      strassen: {
        eyebrow: 'Das Problem',
        text: 'Der Grund für die <span class="hl">verstopften Strassen</span> ist die wachsende Ungleichheit.',
        explainText: 'Dem Staat fehlt das Geld, um vernünftig in Infrastruktur wie Strassen, Züge, Trams, Busse und U-Bahnen zu investieren. Du bezahlst bereits hohe Steuern auf deinem Lohn, doch da der Staat die Superreichen nicht besteuern kann, muss er dich noch weiter ausquetschen oder die Infrastruktur verlottern lassen.',
        link: 'Wie das Vermögen verteilt ist',
      },
      bildung: {
        eyebrow: 'Das Problem',
        text: 'Der Grund für die <span class="hl">sinkende Bildungsqualität</span> ist die wachsende Ungleichheit.',
        explainText: 'Dem Staat fehlt das Geld, um in kleinere Klassen, gut bezahlte Lehrkräfte und gute Schulen zu investieren. Du bezahlst bereits hohe Steuern auf deinem Lohn, doch da der Staat die Superreichen nicht besteuern kann, muss er dich noch weiter ausquetschen oder unsere Schulen verlottern lassen.',
        link: 'Wie ungleich die Schweiz ist',
      },
      erfolgsmodell: {
        eyebrow: 'Das Problem',
        text: 'Die wachsende Ungleichheit zerstört das <span class="hl">Erfolgsmodell Schweiz</span>.',
        explainText: 'Die Schweiz hat keine natürlichen Ressourcen. Was uns ausmacht, ist unser hervorragendes Bildungssystem, unsere zuverlässige Infrastruktur und unsere weltberühmte Qualitätsarbeit. Doch in die Bildung kann nicht mehr investiert werden, die Infrastruktur ist mittlerweile alt und unterfinanziert und Arbeit wird mit hohen Abgaben und Steuern bestraft.',
        link: 'Warum Arbeit mehr zahlt als Vermögen',
      },
      standort: {
        eyebrow: 'Was funktioniert',
        text: 'Der Schweiz geht es so gut, weil wir mit der Vermögenssteuer auch die <span class="hl">Superreichen</span> besteuern.',
        explainText: 'Durch unsere bestehende Vermögenssteuer haben wir bereits ein Instrument, um auch Superreiche zu besteuern und das Geld in Bildung, Infrastruktur, Naturschutz und Sicherheit zu investieren. Genau diese Investitionen locken weitere wohlhabende Personen in unser schönes Land, die alle trotz Vermögenssteuer gerne kommen.',
        link: 'Was eine Vermögenssteuer bringt',
      },
      mittelstand: {
        eyebrow: 'Das Problem',
        text: 'Der Mittelstand trägt heute die <span class="hl">grösste Steuerlast</span>.',
        explainText: 'Wenn du im Mittelstand bist, zahlst du am meisten Steuern und Abgaben auf dein Einkommen. Du zahlst doppelt so viel wie die Superreichen. Dennoch profitierst du nicht von Sozialleistungen wie Prämienverbilligungen oder Zusatzleistungen.',
        link: 'Wer die Steuerlast trägt',
      },
      faireSteuern: {
        eyebrow: 'Die Ungerechtigkeit',
        text: 'Milliardäre zahlen nur <span class="hl">halb so viel</span> Steuern auf ihr Einkommen wie der Mittelstand.',
        explainText: 'Grosse Vermögen sind so strukturiert, dass kaum steuerbares Einkommen anfällt, deshalb zahlen Superreiche viel weniger als du. Das fehlende Geld bezahlst am Ende du über Steuern, Lohnabgaben und Prämien.',
        link: 'Warum das stimmt',
      },
      mindeststeuer: {
        eyebrow: 'Die Lösung',
        text: 'Eine Mindeststeuer von nur <span class="hl">2&nbsp;%</span> sorgt dafür, dass Superreiche gleich viel zahlen wie der Durchschnitt.',
        explainText: 'Eine Mindeststeuer von 2&nbsp;% greift nur bei den ganz grossen Vermögen und bringt der Schweiz Milliarden im Jahr. Genug, um Prämien zu senken, den öV zu verbilligen oder Steuern zu reduzieren.',
        link: 'Wie die Mindeststeuer wirkt',
      },
      keinWegzug: {
        eyebrow: 'Der Mythos',
        text: 'Wegen einer Mindeststeuer von <span class="hl">2&nbsp;%</span> wandert niemand aus der schönen Schweiz aus.',
        explainText: 'Grosse Vermögen wachsen jährlich um ein Vielfaches der 2&nbsp;%, die Steuer ist allein aus der Rendite wieder verdient. Das Geld bleibt also hier und steht der Schweiz für Prämien, öV oder tiefere Steuern zur Verfügung.',
        link: 'Das Wegzug-Argument im Rechner',
      },
      schonFair: {
        eyebrow: 'Fair bleibt fair',
        text: 'Wer heute schon <span class="hl">fair besteuert</span> wird, zahlt mit einer Mindeststeuer keinen Franken mehr.',
        explainText: 'Die Mindeststeuer ist ein Boden, kein Zuschlag: Wer heute schon auf 2&nbsp;% kommt, zahlt keinen Franken mehr. Sie trifft nur die wenigen ganz oben, nicht dich.',
        link: 'So funktioniert die Mindeststeuer',
      },
    },
  },

  // DistributionSection
  distribution: {
    eyebrow: 'Die Verteilung',
    title: 'Wenige besitzen fast alles',
    lead: 'Das reichste 1&nbsp;% besitzt <span class="hl gold">{share}</span> des steuerbaren Vermögens; das mittlere (Median-)Vermögen liegt bei nur <strong>{median}</strong>.',
    leadSourceNote: 'unbeschränkt Steuerpflichtige, 2022',
    legendPeople: 'Anteil an den Menschen',
    legendMoney: 'Anteil am Vermögen',
    labelZero: 'Kein Vermögen',
    labelOver10: 'über 10 Mio.',
    note: 'Steuerbares Reinvermögen pro Steuerfall (Ehepaare = eine Einheit), unbeschränkt Steuerpflichtige {year}.',
    sourceNote: '{year}, unbeschränkt',
    ministat1: 'des Vermögens hält die reichste Schicht ab 1&nbsp;Mio. Das sind nur {pct} der Pflichtigen.',
    ministat2: 'Steuerpflichtige ({pct}) ab 10&nbsp;Mio. besitzen {share} des Vermögens.',
    ministat3: 'Median: die Hälfte aller Pflichtigen hat weniger. Mittelwert (Durchschnitt): {mean}.',
  },

  // CalculatorSection
  calculator: {
    eyebrow: 'Der Rechner',
    title: 'Bau deine Vermögenssteuer',
    lead: 'Verschiebe die Regler und sieh sofort, wie viel eine progressive Vermögenssteuer auf das oberste Prozent einbringen würde. Das Modell rechnet auf den echten ESTV-Vermögensdaten.',
    presetNoteWir2022: 'Exaktes Modell des <strong>World&nbsp;Inequality&nbsp;Report&nbsp;2022</strong>: die Grenzsätze je Vermögensband nach Tabelle&nbsp;7.2 (Szenario moderat / hoch / sehr hoch), <strong>ab 1&nbsp;Mio.</strong> wie im Original, inklusive der rund 324\'000 Pflichtigen mit 1–5&nbsp;Mio. (anders als der 5-Mio-Freibetrag der eigenen Modelle).',
    presetNoteWir2022Source: 'Progressive Vermögenssteuer, Tabelle 7.2',
    thresholdInfo: '<strong>Warum der Freibetrag bei 5 Mio. beginnt:</strong> Bei rund 5 Mio. Franken verläuft die Grenze zum reichsten 1 %. Nur <strong>{cnt}</strong> Steuerpflichtige liegen darüber, die übrigen <strong>{rest}</strong> bleiben komplett steuerfrei. Trotzdem erfasst dieses eine Prozent <strong>{share}</strong> des gesamten steuerbaren Vermögens. Du kannst die Schwelle unten höher ziehen, aber nicht tiefer als 5 Mio., damit die breite Mehrheit garantiert unbelastet bleibt.',
    controlsLock: '<strong>WIR-Referenzmodell aktiv.</strong> Diese Regler bauen ein eigenes Modell.',
    controlsLockLink: 'Klicke hier',
    controlsLockAfter: ', um zum eigenen Modell zurückzukehren.',
    schwelleLabel: 'Freibetrag (steuerfrei bis)',
    schwelleHint: 'Vermögen darunter bleibt komplett steuerfrei. 5 Mio. ≈ das reichste 1 %.',
    basisLabel: 'Grenzsatz an der Schwelle',
    basisHint: 'Satz auf den ersten Franken über dem Freibetrag. Steigt mit der Progression bis zum Cap.',
    exponentLabel: 'Progression (Steilheit)',
    exponentHint: '0 = flacher Satz für alle. Höher = die ganz Grossen zahlen überproportional.',
    capLabel: 'Höchst-Grenzsatz (Cap)',
    capHint: 'Deckel für den Grenzsatz der allergrössten Vermögen.',
    yearLabel: 'Datenjahr:',
    resultLabel: 'Mehreinnahmen ({year})',
    nettoNeuLabel: 'Neue Steuer (Verbliebene)',
    nettoHeuteLabel: 'Heutige Steuern (Abgewanderte)',
    resultUnit: 'CHF pro Jahr',
    sustainableLabel: 'dauerhaft tragbar<br />(dynamisch, siehe unten)',
    avgRateLabel: 'Ø-Satz bei {wealth}',
    readoutCap: 'Grenzsatz erreicht den Cap bei ~{wcap}.',
    readoutEquilibrium: 'Vermögen über ~{eq} zahlen mehr als ihre Rendite, sie schrumpfen, statt zu wachsen.',
    curveTitle: 'Steuersatz nach Vermögen',
    curveSeriesMarginal: 'Grenzsatz',
    curveSeriesAvg: 'Ø-Satz',
    curveLegendMarginal: 'Grenzsatz (auf den nächsten Franken)',
    curveLegendAvg: 'Durchschnittssatz',
    bandTitle: 'Woher das Geld kommt',
    // Beschriftungen der Vermögensbänder (Reihenfolge wie BANDS in taxModel.js).
    bands: {
      0: '1–5 Mio.',
      1: '5–10 Mio.',
      2: '10–100 Mio.',
      3: '100 Mio.–1 Mrd.',
      4: '1–10 Mrd.',
      5: '> 10 Mrd.',
    },
    wegzugLabel: 'Wegzug ab (Szenario)',
    wegzugHint: 'Alle Steuerpflichtigen mit Vermögen über diesem Betrag gelten im Szenario als weggezogen.',
    wegzugNone: 'kein Wegzug',
    wegzugInfo: '<strong>{cnt}</strong> Steuerpflichtige ({year}) mit Vermögen über {schwelle} verlassen im Szenario die Schweiz.',
    wegzugSourceVst: 'Heutige Steuersätze: Vermögenssteuer Ø 0,28 % (NZZ)',
    wegzugSourceEst: 'Einkommenssteuer auf Kapital ~0,9 % des steuerbaren Vermögens (Martínez/KOF)',
    disclaimer: 'Statisches Modell: kein Vermögenszuwachs, kein Verhalten. Der Wegzug-Schieber simuliert ein vereinfachtes Szenario (vollständiger Abgang aller Personen über der Schwelle, ohne Teilwegzug oder Reaktion). Die Zahlen zeigen das <em>Potenzial</em> der Bemessungsgrundlage, nicht eine politische Prognose.',
    sourceNoteEstv: 'Vermögensverteilung + Pareto-Tail >10 Mio.',
    sourceNoteFdk: 'Pauschalbesteuerte im Tail (M)',
  },

  // SpendSection
  spend: {
    eyebrow: 'Was tun mit dem Geld?',
    title: '{revenue} pro Jahr: wofür?',
    lead: 'Dieselben Einnahmen, fünf mögliche Verwendungen. Stell oben am Rechner ein Steuermodell ein und sieh hier in Echtzeit, was damit für alle möglich wäre.',
    toggleDauerhaft: 'Dauerhaft tragbar',
    toggleJahr1: 'Erstes Jahr ({year})',
    hintDauerhaft: 'Stabiles Niveau nach Jahren (siehe Dynamik), die ehrliche Dauergrösse.',
    hintJahr1: 'Vollständiges Aufkommen im ersten Jahr (enthält Einmaleffekt an der Spitze).',
    incomeTitle: 'Einkommenssteuer senken',
    incomeOver: 'über 100 %',
    incomeTextOver: 'Genug, um die <strong>gesamte Einkommenssteuer natürlicher Personen abzuschaffen</strong>.',
    incomeTextUnder: 'So viel tiefer könnte die Einkommenssteuer für <strong>alle</strong> ausfallen (Bund, Kantone, Gemeinden zusammen).',
    incomeFootOver: 'Entspricht dem Mehrfachen der direkten Bundessteuer natürlicher Personen.',
    incomeFootUnder: 'Entspricht dem {pct} der direkten Bundessteuer natürlicher Personen.',
    premiumTitle: 'Krankenkassenprämien übernehmen',
    premiumOver: '100 %',
    premiumTextOver: 'Genug, um <strong>sämtliche selbst getragenen Grundversicherungs-Prämien</strong> der ganzen Schweiz zu bezahlen, also alles, was nach der bestehenden Prämienverbilligung noch übrig bleibt.',
    premiumTextUnder: 'So viel der noch selbst getragenen Grundversicherungs-Prämien (OKP, nach Abzug der bestehenden Prämienverbilligung) könnten für alle <strong>übernommen</strong> werden.',
    premiumFoot: 'Im Schnitt ~{amount} weniger Prämie pro Person und Monat.',
    dividendTitle: 'Pro-Kopf-Dividende',
    dividendText: 'Pro Person und Jahr, an <strong>jede und jeden</strong> der {population} Einwohner:innen.',
    dividendFoot: 'Das sind ~{month} pro Monat, für eine vierköpfige Familie {family} im Jahr.',
    oevTitle: 'öV-Billette verbilligen',
    oevOver: 'gratis',
    oevTextOver: 'Genug, um den <strong>gesamten öffentlichen Verkehr gratis</strong> zu machen, alle Billette und Abos für Bahn, Bus und Tram.',
    oevTextUnder: 'So viel günstiger könnten <strong>alle öV-Billette und -Abos</strong> in der Schweiz werden, über Bahn, Bus und Tram zusammen.',
    oevFoot: 'Bezogen auf die gesamten Fahrgeldeinnahmen des öV von rund {amount} pro Jahr.',
    oevSourceNote: 'Schätzung',
    leftover: 'Danach bleiben noch rund {rest} für anderes übrig.',
    debtfreeTitle: 'Staatsschulden tilgen',
    debtfreeUnit: 'Jahre',
    debtfreeText: 'So viele Jahre, bis das gesamte Aufkommen die <strong>Staatsschuld der Schweiz</strong> (Bund, Kantone, Gemeinden, Sozialwerke; rund 214 Mrd. nach Maastricht) vollständig getilgt hätte. Aufsummiert über die dynamische Hochrechnung, nicht das flache Vielfache eines Jahres.',
    debtfreeTextFlat: 'So viele Jahre, bis das Aufkommen die <strong>Staatsschuld der Schweiz</strong> (Bund, Kantone, Gemeinden, Sozialwerke; rund 214 Mrd. nach Maastricht) vollständig getilgt hätte. Flache Hochrechnung: Aufkommen konstant pro Jahr.',
    debtfreeFoot: 'Kumuliert über die dynamische Hochrechnung, inkl. {rendite} Rendite p.a.',
    debtfreeFootFlat: 'Aufkommen konstant, ohne dynamische Projektion.',
    f35Title: 'F-35-Kampfjets kaufen',
    f35TextUnder: 'So viele F-35A könnten pro Jahr beschafft werden, zum tatsächlichen Gesamtstückpreis von rund CHF {price} Mio. Die Schweizer Armee kauft {fleet} Stück insgesamt.',
    f35TextOver: 'Die ganze Schweizer Flotte von {fleet} F-35A wäre pro Jahr finanziert, mit {extra} Jets übrig.',
    f35Foot: 'Volkskredit (indexiert CHF 6,429 Mrd.) + Nachtragskredit CHF 394 Mio. = CHF 6,823 Mrd. für {fleet} Jets, Armeebotschaft März 2026.',
    f35Unit: 'F-35',
    disclaimer: 'Bezugsgrössen aus offiziellen Quellen (EFV/ESTV, BAG, BFS, LITRA), gerundet, nominal. Es ist <em>entweder/oder</em>: jeder Franken kann nur einmal ausgegeben werden. Die Beispiele zeigen die Grössenordnung, keine fertige Politik.',
    srcsLabel: 'Aufkommen (Zähler):',
    sourceNoteEstv: 'Aufkommen aus dem Rechner, Pareto-Tail >10 Mio.',
    sourceNoteFdk: 'Pauschalbesteuerte im Tail (M)',
  },

  // ProjectionSection
  projection: {
    eyebrow: 'Ehrlich gerechnet',
    title: 'Einmaliger Schock oder dauerhafte Quelle?',
    lead: 'Vermögen wächst (Rendite), die Steuer bremst. Diese mechanische Hochrechnung zeigt beide Fälle: <strong>steile</strong> Modelle besteuern die Spitze im ersten Jahr stark und pendeln sich danach auf ein tieferes, dauerhaft tragbares Niveau ein; <strong>milde</strong> Modelle bremsen kaum, dann wächst die Bemessungsgrundlage weiter und das Aufkommen steigt mit.',
    seriesName: 'Aufkommen',
    yLabel: 'Mrd. CHF / Jahr',
    firstLabel: 'Aufkommen im ersten Jahr',
    lastLabelDown: 'dauerhaft tragbares Niveau (2032)',
    lastLabelUp: 'Aufkommen 2032, Vermögen wächst weiter',
    lastLabelFlat: 'stabiles Niveau (2032)',
    renditeLabel: 'Angenommene Rendite p.a.',
    renditeHint: 'Voreingestellt 6 %, der untere Rand des realen Vermögenszuwachses an der Spitze (World Inequality Report 2022: 6 bis 9 % seit 1995). Je höher die Rendite, desto mehr trägt die Substanz dauerhaft.',
    formula: 'Rein mechanisch: ohne Abwanderung, Konsum oder neue Vermögen. <code>W(t+1) = W(t)·(1+r) − Steuer(W(t))</code>',
    sourceNoteEstv: 'Kohorten ab 2022, dynamische Projektion',
    sourceNoteFdk: 'Pauschalbesteuerte im Pareto-Tail (M)',
    sourceNoteRendite: 'Voreingestellte Rendite 6 % real (unterer Rand 6–9 %, Spitze seit 1995)',
  },

  // InternationalSection
  international: {
    eyebrow: 'Im internationalen Vergleich',
    title: 'Die Konzentration steigt, auch in der Schweiz',
    lead: 'Anteil am gesamten Netto-Privatvermögen, 1995–2024. In der Schweiz hält das reichste Prozent heute spürbar mehr als noch in den 1990ern, ein weltweiter Trend.',
    metrics: {
      top1Label: 'Top 1 %',
      top1Desc: 'Vermögensanteil des reichsten Prozents',
      top10Label: 'Top 10 %',
      top10Desc: 'Vermögensanteil der reichsten 10 %',
      bot50Label: 'Untere 50 %',
      bot50Desc: 'Vermögensanteil der ärmeren Hälfte',
      giniLabel: 'Vermögens-Gini',
      giniDesc: 'Gini des Netto-Privatvermögens (0 = gleich, 1 = einer hat alles)',
    },
    widNoteGini: 'Variable ghwealj992 (Vermögens-Gini)',
    widNoteShare: 'Variable shwealj992, net personal wealth',
    compareTitle: '{metric} heute ({year})',
    sourceNoteShares: 'Anteile',
    note: 'Hinweis: WID-Anteile (Gesamtvermögen) und die ESTV-Steuerdaten messen Verschiedenes: die Steuerdaten erfassen nur steuerbares Vermögen und wirken dadurch konzentrierter. Beide Quellen zeigen denselben Trend.',
  },

  // WirSection
  wir: {
    eyebrow: 'World Inequality Report',
    title: 'Woher die Steuermodelle stammen: WIR&nbsp;2022 &amp; 2026',
    lead: 'Das <strong>World Inequality Lab</strong> (u.&nbsp;a. Thomas Piketty, Lucas Chancel, Gabriel Zucman) führt die umfassendste Datenbank zur globalen Vermögens- und Einkommensverteilung. Zwei Ausgaben seines Flaggschiff-Reports schlagen <strong>zwei unterschiedliche Steuer-Designs</strong> vor: 2022 eine progressive Vermögenssteuer, 2026 eine flache Mindeststeuer. Die progressive Staffel von 2022 liegt als Preset im Rechner; das Mindeststeuer-Design von 2026 steht im Abschnitt «Zucman-Steuer».',
    card2022Badge: '2022',
    card2022Title: 'Progressive Staffel',
    card2022Sub: 'Drei Szenarien (moderat&nbsp;/ hoch&nbsp;/ sehr&nbsp;hoch)',
    card2022Li1: 'Grenzsätze von <strong>1&nbsp;%</strong> ab 1&nbsp;Mio. steigend bis <strong>3,5&nbsp;/ 10&nbsp;/ 90&nbsp;%</strong> über 100&nbsp;Mrd.&nbsp;$.',
    card2022Li2: 'Ertrag je nach Szenario <strong>1,6&nbsp;bis 5,3&nbsp;%</strong> des globalen Einkommens.',
    card2022Li3: 'Sechs Vermögensbänder mit je eigenem Grenzsatz (Tabelle&nbsp;7.2).',
    card2022Link: 'wir2022.wid.world ↗',
    card2026Badge: '2026',
    card2026Title: 'Flache Mindeststeuer',
    card2026Sub: '3.&nbsp;Ausgabe (nach 2018 &amp; 2022), nach Zucman&nbsp;/ G20',
    card2026Li1: 'Neuer Befund: Milliardäre zahlen effektiv nur <strong>~20&nbsp;% ihres Einkommens</strong> an Steuern, <strong>weniger</strong> als Haushalte mit tieferem Einkommen (regressiv).',
    card2026Li2: 'Antwort: Mindeststeuer <strong>2&nbsp;/ 3&nbsp;/ 5&nbsp;%</strong> auf Centi-Millionäre&nbsp;und&nbsp;Milliardäre.',
    card2026Li3: '2&nbsp;% auf Milliardäre ≈ <strong>200&nbsp;bis&nbsp;250&nbsp;Mrd.&nbsp;$</strong> pro Jahr.',
    card2026Link: 'wir2026.wid.world ↗',
    shift: '<strong>Was sich geändert hat:</strong> 2022 schlägt einen progressiven Mehrband-Tarif vor, 2026 eine <strong>flache Mindeststeuer</strong> auf Centi-Millionäre und Milliardäre, aufbauend auf Zucman&nbsp;(2024), den die brasilianische G20-Präsidentschaft 2024 auf die Agenda setzte. Laut WIR&nbsp;2026 «neutralisiert» bereits ein Satz von 2&nbsp;% die Regressivität an der Spitze. Die progressive Staffel von 2022 kannst du <a href="/rechner">im Rechner</a> als Preset durchprobieren; die Mindeststeuer von 2026 schlägt keine Vermögenssteuer vor und steht deshalb nicht im Rechner, sondern im Abschnitt <a href="#zucman">Zucman-Steuer</a>. Das interaktive Original-Tool zur progressiven Staffel ist der <a href="https://wid.world/world-wealth-tax-simulator/" target="_blank" rel="noopener">Global&nbsp;Wealth&nbsp;Tax&nbsp;Simulator</a> des World&nbsp;Inequality&nbsp;Lab.',
    videoLabel: 'Video · Gary\'s Economics mit Gabriel Zucman',
    videoTitle: '«The economist billionaires fear: this is how we get a wealth tax»',
    videoHint: 'youtube.com ↗',
    sourceNote2022: 'Progressive Szenarien, Tabelle 7.2',
    sourceNote2026: 'Globale Mindeststeuer, Kapitel 7',
  },

  // ZucmanSection
  zucman: {
    eyebrow: 'Zucmans Mindeststeuer',
    title: 'Eine 2&nbsp;%-Mindeststeuer auf das Vermögen',
    lead: 'Drei Fragen: Was schlägt Gabriel Zucman vor? Was zahlen die Superreichen heute? Was bringt die Mindeststeuer der Schweiz?',

    wantHeading: 'Was Zucman vorschlägt',
    wantText: 'Eine <strong>Mindeststeuer von 2&nbsp;%</strong> auf das gesamte Vermögen, für alle ab 100&nbsp;Mio. Es ist eine <em>Mindeststeuer</em>, kein Zuschlag: Wer mit seinen heutigen Steuern bereits auf 2&nbsp;% des Vermögens kommt, ist befreit; wer darunter liegt, stockt auf 2&nbsp;% auf. In der Schweiz halten die ~300&nbsp;Reichsten zusammen <strong>851,5&nbsp;Mrd.</strong> zu Marktwerten (Bilanz&nbsp;2025). Diese Zahl ist die Basis der Rechnung.',
    wantSource: 'Zucmans Mindeststeuer',
    baseSource: 'Die 300 Reichsten 2025',

    todayHeading: 'Was die Superreichen heute zahlen',
    todayText: 'Gemessen am Marktvermögen ist die heutige Last tief:',
    todayItem1: '<strong>Vermögenssteuer:</strong> ~0,3&nbsp;% des Marktvermögens.',
    todayItem2: '<strong>Einkommenssteuer</strong> auf die Vermögenserträge: ~0,5&nbsp;%.',
    todaySum: '<strong>Zusammen ~0,8&nbsp;%</strong> des Vermögens, nicht einmal die Hälfte der von Zucman geforderten 2&nbsp;%. Sie zahlen heute zu wenig.',
    todaySource: 'Vermögenssteuer Ø 0,28 %',
    todaySource2: 'effektive Sätze der Superreichen',

    extraHeading: 'Was sie zusätzlich zahlen und was die Schweiz erhält',
    extraText: 'Die Mindeststeuer hebt die Last von ~0,8&nbsp;% auf 2&nbsp;%. Die Differenz, ~1,2&nbsp;% des Vermögens, ist die Mehrbelastung. Pro 100&nbsp;Mio. heisst das ~1,2&nbsp;Mio. mehr im Jahr.',
    calcLine: '(2&nbsp;% &minus; 0,8&nbsp;%) × 851,5&nbsp;Mrd.',
    calcResult: '~10&nbsp;Mrd. pro Jahr für die Schweiz',

    daysLine: 'Grosse Vermögen wachsen passiv um <strong>~7,1&nbsp;% pro Jahr</strong> (real, nach Inflation): Dividenden, Zinsen und Vermögensgewinne zusammen. Selbst die <strong>ganze Mindeststeuer von 2&nbsp;%</strong>, nicht nur die Mehrbelastung, ist damit wieder verdient in:',
    daysUnit: 'Tagen',
    daysSub: 'Gut <strong>drei Monate</strong>, ohne einen Finger zu rühren. Den Rest des Jahres wächst das Vermögen weiter.',
    daysSource: 'Vermögenszuwachs ~7,1 % p. a. (1987–2024)',

    medHeading: 'Und ein normaler Haushalt?',
    medLine: 'Wie lange dauert es, die ganze Jahressteuer wieder zu verdienen?',
    medColIncome: 'Bruttoeinkommen (CHF/Monat)',
    medColPassive: 'aus dem Vermögenseinkommen',
    medColTotal: 'aus dem gesamten Einkommen',
    medRowArbeiter: 'Arbeiterhaushalt (mittleres Fünftel)',
    medRowMittel: 'Mittelständischer Haushalt (Durchschnitt)',
    medUnit: 'Jahre',
    medDaysUnit: 'Tage',
    medCaption: '«Aus dem Vermögenseinkommen» heisst passiv, «aus dem gesamten Einkommen» vor allem Arbeit. Der <strong>Arbeiterhaushalt</strong> (mittleres Einkommensfünftel) lebt fast nur von Arbeit. Den <strong>Durchschnitt</strong> aller Haushalte zieht die Vermögensspitze nach oben, deshalb wirkt sein passives Einkommen grösser und die Steuer ist dort scheinbar schneller wieder verdient.',
    medSource: 'Arbeiterhaushalt (mittleres Fünftel) / Durchschnitt aller Haushalte: Steuern 10,1 % / 11,7 %, Vermögenseinkommen 2,6 % / 4,5 % des Bruttoeinkommens (HABE 2015–2017)',

    meaningHeading: 'Was ~10 Mrd. bedeuten',
  },

  // UbsStudySection
  ubs: {
    eyebrow: 'Die UBS/CS-Studie',
    title: 'Was der UBS&nbsp;Global&nbsp;Wealth&nbsp;Report über die Schweiz sagt',
    lead: 'Der <strong>Global Wealth Report</strong> ist die wohl bekannteste weltweite Vermögensstudie. Jahrzehntelang erschien sie unter dem Namen <strong>Credit Suisse</strong>. Seit der Übernahme 2023 trägt sie das Logo der <strong>UBS</strong>. Ausgerechnet die Bank, die den grössten Bankenkollaps der jüngeren Schweizer Geschichte aufgefangen hat, vermisst nun die Vermögen der Welt.',
    giniCardLabel: 'Vermögens-Gini der Schweiz<br />(0 = gleich, 1 = einer hat alles)',
    rankCardValue: 'Platz&nbsp;{rank}',
    rankCardLabel: 'von {total} verglichenen Ländern, die Schweiz liegt im oberen Mittelfeld',
    spreadCardLabel: 'Spannweite in der Stichprobe: von {highest} bis {lowest}',
    giniChartTitle: 'Vermögens-Gini im Ländervergleich',
    giniChartIntro: 'Der Gini-Koeffizient misst, wie ungleich das gesamte Nettovermögen verteilt ist. Je höher der Wert, desto stärker konzentriert sich der Reichtum bei wenigen. Die <span class="ch-text">Schweiz</span> liegt, trotz Wohlstand und Stabilität, im oberen Mittelfeld der Stichprobe.',
    giniChartSource: 'Vermögens-Gini, Daten Ende 2024',
    avgMedianHeading: 'Durchschnitt vs. Median: dieselbe Lücke, anders gemessen',
    avgMedianIntro: 'Bei einem Wert führt die Schweiz die Studie an: beim <strong>durchschnittlichen Vermögen pro erwachsene Person</strong>, weltweit Platz {avgRank}. Beim <strong>Median</strong>, der «mittleren» Person, reicht es nur für Platz {medRank}. Der Durchschnitt wird von einer schmalen Spitze nach oben gezogen; die mittlere Person besitzt nur {medianShare} davon.',
    avgCardLabel: 'Ø-Vermögen pro Erwachsenem, Weltrang {rank}',
    medianCardLabel: 'Median-Vermögen pro Erwachsenem, nur Rang {rank}',
    ratioCardLabel: 'So viel höher ist der Durchschnitt als der Median in der Schweiz',
    ratioChartTitle: 'Wie weit der Durchschnitt über dem Median liegt',
    ratioChartIntro: 'Verhältnis von Durchschnitts- zu Median-Vermögen pro Erwachsenem (reichste Märkte der Studie). Je höher der Faktor, desto stärker zieht eine schmale Spitze den Schnitt über die Mitte. Die <span class="ch-text">Schweiz</span> liegt auch hier ganz vorne. Genau diese Lücke macht diese Seite sichtbar.',
    ratioChartSource: 'Ø/Median-Vermögen pro Erwachsenem, Ende 2024',
    pyramidHeading: 'Die globale Vermögenspyramide',
    pyramidIntro: 'Dieselbe Studie für die ganze Welt: Das reichste <strong>{topAdults}</strong> der Erwachsenen besitzt <strong>{topWealth}</strong> des gesamten Nettovermögens, die unteren <strong>{bottomAdults}</strong> zusammen nur <strong>{bottomWealth}</strong>.',
    pyramidChartTitle: 'Vermögensanteil je Vermögensband (Welt 2024)',
    pyramidChartIntro: 'Anteil am weltweiten Nettovermögen je Band; in Klammern der Anteil an allen Erwachsenen. Eine schmale Spitze hält fast die Hälfte, die breite Basis kaum etwas.',
    pyramidChartSource: 'Globale Vermögenspyramide, Ende 2024',
    pyramidBandSub: '{share} der Erwachsenen',
    homeMarket: 'UBS-Heimmarkt',
  },

  // PauschalSection
  pauschal: {
    eyebrow: 'Der blinde Fleck',
    title: 'Die {count} ohne Vermögensstatistik',
    lead: 'Aufwandbesteuerte («Pauschalbesteuerte») werden nach ihren Lebenshaltungskosten veranlagt, ihr tatsächliches Vermögen wird gar nie erhoben. Sie fehlen deshalb in der ESTV-Vermögensstatistik, obwohl viele zu den Vermögendsten des Landes zählen. Im Rechner sind sie modellhaft im Tail über 10&nbsp;Mio. mitgedacht.',
    cardCountLabel: 'Personen mit Aufwandbesteuerung (2018)',
    cardRevenueLabel: 'Gesamter Steuerertrag (Bund + Kanton + Gemeinde)',
    cardAvgLabel: 'Ø Steuer pro Person und Jahr',
    note: 'Spannweite der einzelnen Pauschalsteuer 2018: von {lowest} bis {highest}. «Personen» (FDK) sind nicht dasselbe wie «Steuerfälle» (ESTV).',
    sourceNote: 'Stand 31.12.2018',
  },

  // SourcesSection
  sources: {
    eyebrow: 'Transparenz',
    title: 'Quellen &amp; Methodik',
    lead: 'Alle Kernzahlen stammen aus offiziellen, öffentlich zugänglichen Statistiken. Die Berechnungen sind nachvollziehbar und reproduzieren die zugrunde liegenden Workbooks exakt. Nichts ist erfunden, die Schlussfolgerung ist politisch, die Daten nicht.',
    methodTitle: 'Methodische Ehrlichkeit',
    methodLi1: '<strong>Steuerbares Vermögen ≠ Marktvermögen.</strong> Die ESTV-Daten enthalten keine 2./3. Säule und bewerten Liegenschaften zum Steuerwert, das reale Vermögen der Spitze ist eher noch höher.',
    methodLi3: '<strong>Pareto-Tail.</strong> Vermögen über 10&nbsp;Mio. werden mit einem Pareto-Index aus den ESTV-Klassenmitteln extrapoliert; Pauschalbesteuerte sind modellhaft im selben Tail angenommen.',
    methodLi4: '<strong>Verschiedene Bezugsgrössen.</strong> WID/UBS messen das gesamte Netto-Privatvermögen, die ESTV nur das steuerbare. Vergleiche sind indikativ, nicht zellengenau.',
    methodLi6: '<strong>Zucman-Abschnitt ist eine Schätzung.</strong> Die heutige Effektivlast und das Zusatzaufkommen der 2&nbsp;%-Mindeststeuer sind eine eigene, statische Herleitung auf belegten Eingangsgrössen (Bilanz, Momentum, NZZ, WOZ), keine amtliche Zahl und nicht aus der ESTV-Pipeline reproduzierbar. Die Rechnung steht offen im Abschnitt «Zucman-Steuer» und in der Methodik-Dokumentation.',
    methodLi5: '<strong>WIR-Referenzmodell (2022).</strong> Das Preset «WIR 2022» (progressive Grenzsatz-Staffel, Tabelle 7.2) bildet das Steuermodell des World Inequality Report exakt ab, über eine dedizierte Funktion, nicht über die Potenzkurve. Übertragen wird die Satz-Struktur; die USD-Schwellen werden ohne Wechselkurs (≈&nbsp;Parität) in CHF behandelt, daher sind die CHF-Beträge nicht mit den globalen USD-Erträgen des Reports vergleichbar. Der WIR 2026 schlägt eine flache Mindeststeuer statt einer Vermögenssteuer vor und ist deshalb kein Preset im Rechner.',
    footer: 'Erstellt direkt aus den Primärquellen (ESTV-Vermögenssteuerstatistik 2012–2022, WID/UBS-Vermögensverteilung, World Inequality Report 2022 &amp; 2026, FDK, EFV, BAG, BFS) über eine reproduzierbare Fetch- und Extraktions-Pipeline. Diese Seite ist ein unabhängiges, politisches Argument für eine Vermögenssteuer auf das reichste 1 %.',
  },

  // Voreingestellte Steuermodelle (useCalculator.js)
  presets: {
    groupWir22: 'WIR 2022',
    flach: 'Flach',
    moderat: 'Moderat',
    steil: 'Stark progressiv',
    wir2022_1: 'moderat',
    wir2022_2: 'hoch',
    wir2022_3: 'sehr hoch',
  },

  // Gemeinsame UI-Bausteine
  ui: {
    sourcePrefix: 'Quelle:',
  },

  // Globale Fusszeile (App.vue) mit den rechtlichen Seiten.
  siteFooter: {
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
    quellen: 'Quellen',
    start: 'Start',
  },

  // Impressum (ImpressumSection.vue). Die Seite ist nicht kommerziell; die
  // Angaben erfüllen die Identifikationspflicht des revidierten DSG.
  impressum: {
    eyebrow: 'Rechtliches',
    title: 'Impressum',
    lead: 'Verantwortlich für diese Website.',
    operatorTitle: 'Verantwortliche Person',
    operatorName: 'Thomas Mannhart',
    operatorRole: 'Privatperson',
    contactTitle: 'Kontakt',
    contactEmailLabel: 'E-Mail',
    contactEmail: "thomas{'@'}mannhart.ai",
    natureTitle: 'Art des Angebots',
    natureBody: 'Diese Website ist ein privates, nicht kommerzielles Informationsangebot zu einem politischen Thema. Es werden keine Waren oder Dienstleistungen angeboten und nichts verkauft. Eine Impressumspflicht nach Art.&nbsp;3 Abs.&nbsp;1 lit.&nbsp;s <a href="https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de" target="_blank" rel="noopener">UWG</a> besteht für ein solches Angebot nicht; die obigen Angaben erfüllen freiwillig die Identifikationspflicht des Datenschutzgesetzes.',
    liabilityTitle: 'Haftung für Inhalte und Links',
    liabilityBody: 'Die Inhalte werden mit Sorgfalt aus den unter <a href="/quellen">Quellen &amp; Methodik</a> belegten Primärquellen erstellt. Für externe Links wird keine Haftung übernommen; für deren Inhalte sind ausschliesslich die jeweiligen Betreiber verantwortlich.',
    privacyHint: 'Wie diese Website mit Personendaten umgeht, steht in der <a href="/datenschutz">Datenschutzerklärung</a>.',
  },

  // Datenschutzerklärung (DatenschutzSection.vue). Mindestinhalt nach Art. 19
  // des revidierten DSG: Verantwortlicher, Zweck, Empfänger, Bekanntgabe ins
  // Ausland, Betroffenenrechte. Die Seite ist statisch, ohne Cookies und Tracking.
  datenschutz: {
    eyebrow: 'Rechtliches',
    title: 'Datenschutzerklärung',
    lead: 'Diese Website verarbeitet so wenige Personendaten wie technisch möglich. Es gibt keine Cookies, keine Tracker, keine Analyse-Werkzeuge und keine Formulare.',
    updated: 'Stand: Juni 2026',

    controllerTitle: 'Verantwortlicher',
    controllerBody: 'Verantwortlich im Sinne des <a href="https://www.fedlex.admin.ch/eli/cc/2022/491/de" target="_blank" rel="noopener">Datenschutzgesetzes (DSG)</a> ist Thomas Mannhart. Anfragen zum Datenschutz richtest du an <a href="mailto:thomas{\'@\'}mannhart.ai">thomas{\'@\'}mannhart.ai</a>.',

    scopeTitle: 'Welche Daten bearbeitet werden',
    scopeBody: 'Die Seite ist eine statische Website. Beim Besuch werden keine Konten geführt und keine Eingaben gespeichert. Personendaten fallen nur als technische Server-Protokolle an, die beim Ausliefern jeder Website entstehen.',

    logsTitle: 'Server-Protokolle (Hosting)',
    logsIntro: 'Die Website wird über <strong>GitHub&nbsp;Pages</strong> ausgeliefert (GitHub,&nbsp;Inc., USA). Der Hosting-Anbieter erfasst beim Abruf automatisch technische Daten:',
    logsLi1: 'IP-Adresse des anfragenden Geräts',
    logsLi2: 'Datum und Uhrzeit des Abrufs',
    logsLi3: 'abgerufene Adresse sowie übermittelte Datenmenge',
    logsLi4: 'Browser-Typ und Betriebssystem (User-Agent), gegebenenfalls die verweisende Seite',
    logsPurposeLabel: 'Zweck',
    logsPurpose: 'Auslieferung, Betrieb, Sicherheit und Stabilität der Website. Eine Auswertung zu einzelnen Personen findet nicht statt.',
    logsRecipientLabel: 'Empfänger',
    logsRecipient: 'GitHub,&nbsp;Inc. als Hosting-Dienstleister.',

    abroadTitle: 'Bekanntgabe ins Ausland',
    abroadBody: 'Da GitHub&nbsp;Pages in den USA betrieben wird, können die Server-Protokolle in den <strong>USA</strong> bearbeitet werden. GitHub stützt diese Bearbeitung auf vertragliche Garantien (Standardvertragsklauseln) und beschreibt sie in seiner <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">Datenschutzerklärung</a>. Hinweise zur Datenerfassung durch GitHub&nbsp;Pages stehen <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages" target="_blank" rel="noopener">in der GitHub-Dokumentation</a>.',

    cookiesTitle: 'Keine Cookies, kein Tracking',
    cookiesBody: 'Diese Website setzt keine Cookies, bindet keine Analyse- oder Werbedienste ein und lädt keine externen Schriften oder Skripte von Dritten. Es findet kein Profiling und keine automatisierte Einzelentscheidung statt.',

    linksTitle: 'Links zu Dritt-Websites',
    linksBody: 'Die Seite verlinkt auf externe Quellen und Werkzeuge (etwa amtliche Statistiken oder den Global&nbsp;Wealth&nbsp;Tax&nbsp;Simulator). Für deren Inhalte und Datenbearbeitung gelten die jeweils dort veröffentlichten Datenschutzerklärungen.',

    rightsTitle: 'Deine Rechte',
    rightsBody: 'Nach dem DSG hast du das Recht auf Auskunft über die zu deiner Person bearbeiteten Daten sowie auf deren Berichtigung oder Löschung. Diese Website speichert selbst keine Daten zu identifizierbaren Personen. Personenbeziehbar sind allein die technischen Server-Protokolle, die GitHub als Hosting-Anbieter führt und auf die der Betreiber dieser Seite keinen Zugriff hat. Auskunfts-, Berichtigungs- oder Löschungsanfragen zu diesen Protokollen richtest du deshalb direkt an GitHub unter <a href="mailto:privacy{\'@\'}github.com">privacy{\'@\'}github.com</a> und nicht an den Betreiber dieser Seite.',

    changesTitle: 'Änderungen',
    changesBody: 'Diese Datenschutzerklärung kann angepasst werden, wenn sich die Website oder die rechtlichen Vorgaben ändern. Massgebend ist die jeweils hier veröffentlichte Fassung.',
  },
};
