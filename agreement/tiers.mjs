/**
 * The three depths of the agreement, and which items each one needs.
 *
 * One document, filled to the depth the project needs. Every numbered item
 * carries the lowest tier it applies to; ui.item() reads it from here and
 * fails the build for an item that has none, so a new item cannot be added
 * without deciding who has to fill it in. An item above the chosen tier is
 * skipped, and its default below applies instead, so skipping never leaves a
 * question unanswered.
 */

export const TIER_NAMES = {
  1: 'Feasibility',
  2: 'Validation',
  3: 'Data contribution and model development',
}

export const TIER_SUMMARY = {
  1: 'A few recordings, anonymised by the Provider (3.4), analysed and deleted on the timetable in 4.6. Nothing is used for models.',
  2: 'A defined dataset for a project: validation against the Provider’s labels, an integration, a study. Kept for the project; models may be evaluated on it, never trained.',
  3: 'Data that joins the Oxynet research corpus, or trains models. Every item applies.',
}

/** Lowest tier each item applies to. */
export const TIERS = {
  '0.1': 1,
  '1.1': 1, '1.2': 2, '1.3': 2, '1.4': 1, '1.5': 1,
  '2.1': 1, '2.2': 2, '2.3': 2, '2.4': 1,
  '3.1': 1, '3.2': 2, '3.3': 2, '3.4': 1, '3.5': 2, '3.6': 1,
  '4.1': 1, '4.2': 1, '4.3': 1, '4.4': 2, '4.5': 1, '4.6': 1, '4.7': 2, '4.8': 1,
  '5.1': 2, '5.2': 3, '5.3': 3, '5.4': 3, '5.5': 3, '5.6': 3,
  '6.1': 1, '6.2': 1, '6.3': 2, '6.4': 2, '6.5': 2,
  '7.1': 2,
  '8.1': 2, '8.2': 1, '8.3': 1,
  '9.1': 1, '9.2': 1, '9.3': 2, '9.4': 2, '9.5': 1, '9.6': 1,
}

/**
 * What applies when an item is skipped because it sits above the chosen tier.
 * Only items that would otherwise leave something undecided need one; fixed
 * terms and descriptive items (1.2, 2.3, 3.2...) simply are not recorded.
 */
export const DEFAULTS = [
  ['4.4', 'Only the Recipient\u2019s scientific contact (1.5)'],
  ['4.7', 'No separate confirmation: the Data is deleted on the timetable in 4.6'],
  ['5.1', 'No: never used for model development'],
  ['5.2 to 5.6', 'Not applicable: nothing is used for model development'],
  ['6.3', 'The Provider may use the outputs freely'],
  ['6.4', 'No publication without both parties\u2019 written consent'],
  ['6.5', 'The Provider is not mentioned'],
  ['7.1', 'No payment in either direction'],
  ['8.1', 'Until the purposes are complete'],
  ['9.3', '72 hours'],
  ['9.4', 'Neither party is liable for indirect or consequential loss'],
]

export function tierOf(id) {
  const t = TIERS[id]
  if (!t) throw new Error(`agreement: item ${id} has no tier in agreement/tiers.mjs`)
  return t
}
