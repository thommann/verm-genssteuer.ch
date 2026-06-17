// Wandelt eine Vierfarben-Palette ([g1, g2, g3, g4]) in die CSS-Custom-Properties um, die
// die Aussage- und Artikel-Bänder (.claim-band, --g1..--g4) als Verlauf nutzen.
export const bandVars = (bg) => ({ '--g1': bg[0], '--g2': bg[1], '--g3': bg[2], '--g4': bg[3] });
