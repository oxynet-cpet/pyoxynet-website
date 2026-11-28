/**
 * The three evidence-maturity states, as the manual defines them (Part Four,
 * 4.1). The site and the manual must use the same three words for the same
 * three things, so a partner who reads both never meets a fourth.
 */

export type Maturity = 'production' | 'available' | 'research'

export const MATURITY: Record<Maturity, { label: string; meaning: string; className: string }> = {
  production: {
    label: 'Production',
    meaning:
      'Answering on the live API, with the evaluation that let each model ship stored beside it.',
    className: 'text-accent border-accent/35 bg-accent/10',
  },
  available: {
    label: 'Available',
    meaning:
      'Shipped and usable. These are the interfaces, the package and the desktop application; the science behind them is Production or Research.',
    // Mid-blue reads on both grounds; the brand blue #155799 is too dark on the dark one.
    className: 'text-sky-500 border-sky-500/40 bg-sky-500/10',
  },
  research: {
    label: 'Research',
    meaning:
      'Running, and not yet shown to transport to a new population. Treat outputs as research findings.',
    className: 'text-warn border-warn/40 bg-warn/10',
  },
}
