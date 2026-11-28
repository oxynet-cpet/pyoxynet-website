import type { Publication } from '@/types'

/**
 * Peer-reviewed journal articles in the list below. Derived, never asserted:
 * this array also holds a preprint and several blog and Medium pieces, which
 * are writing about the work and not evidence for it. The site and the PDF
 * manual both count from here, so the two cannot drift.
 */
export const isPeerReviewed = (p: Publication): boolean =>
  (p.type === 'research' || p.type === 'review') &&
  p.year !== undefined &&
  p.journal !== undefined &&
  p.journal !== 'Preprint'

export const PEER_REVIEWED_COUNT = (): number => PUBLICATIONS.filter(isPeerReviewed).length

export const PUBLICATIONS: Publication[] = [
  {
    type: 'research',
    title: 'AI-Driven Analysis of Cardiopulmonary Exercise Tests to Identify Gas Exchange and Ventilatory Thresholds',
    description:
      'Oxynet, fine-tuned on 163 tests, against three experts on 50 independent ramp tests: mean VO₂ differences of 45 and −26 mL/min at the lactate threshold and the respiratory compensation point.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41784915/',
    year: 2026,
    journal: 'Sports Medicine',
  },
  {
    type: 'research',
    title: 'How the Oxynet web applications are used to crowdsource and interpret cardiopulmonary exercising tests data',
    description:
      'How the Oxynet web applications are used: one to crowdsource tests, the other to interpret new ones with the trained network.',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S1746809423002690',
    year: 2023,
    journal: 'Biomedical Signal Processing and Control',
  },
  {
    type: 'review',
    title: 'State-of-the art concepts and future directions in modelling oxygen consumption and lactate concentration in cycling exercise',
    description:
      'A review of how oxygen uptake and blood lactate are modelled during cycling exercise, and where that modelling could go next.',
    url: 'https://link.springer.com/article/10.1007%2Fs11332-019-00557-x',
    year: 2019,
    journal: 'Sport Sciences for Health',
  },
  {
    type: 'research',
    title: 'Estimating an individual’s oxygen uptake during cycling exercise with a recurrent neural network trained from easy-to-obtain inputs: A pilot study',
    description:
      'A recurrent network estimates VO₂ from heart rate, power output, cadence and breathing frequency in 7 cyclists: mean absolute error 229 mL/min on a protocol it was not trained on (r = 0.94).',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0229466',
    year: 2020,
    journal: 'PLOS ONE',
  },
  {
    type: 'research',
    title: 'Expert-level classification of ventilatory thresholds from cardiopulmonary exercising test data with recurrent neural networks',
    description:
      'A recurrent network trained on 228 laboratory tests, compared with 7 pairs of board-certified exercise physiologists on 25 tests: mean absolute error 9.5% at VT1 and 4.2% at VT2.',
    url: 'https://doi.org/10.1080/17461391.2019.1587523',
    year: 2019,
    journal: 'European Journal of Sport Science',
  },
  {
    type: 'research',
    title: 'Oxynet: A collective intelligence that detects ventilatory thresholds in cardiopulmonary exercise tests',
    description:
      'A convolutional network trained on 1,245 crowdsourced tests and evaluated against experts on 206: mean absolute error 178 mL/min at VT1 and 144 mL/min at VT2, with VT1 weaker in subjects of low aerobic fitness.',
    url: 'https://doi.org/10.1080/17461391.2020.1866081',
    year: 2022,
    journal: 'European Journal of Sport Science',
  },
  {
    type: 'research',
    title: 'Conditional GANs for Synthetic CPET Data',
    description:
      'Synthetic cardiopulmonary exercise tests generated with a conditional generative adversarial network.',
    url: 'https://www.overleaf.com/read/fcmwscvyhtfq',
    journal: 'Preprint',
  },
  {
    type: 'research',
    title: 'Machine Learning Models for the Automatic Detection of Exercise Thresholds in Cardiopulmonary Exercising Tests: From Regression to Generation to Explanation',
    description:
      'Three problems in one framework: a convolutional network for the intensity domains, a conditional GAN whose synthetic tests experts could not reliably tell from real ones, and Shapley values to explain the model’s choices.',
    url: 'https://doi.org/10.3390/s23020826',
    year: 2023,
    journal: 'Sensors (MDPI)',
  },
  {
    type: 'linkedin',
    title: 'Oxynet: A Collective Intelligence Approach',
    description:
      'An overview of the Oxynet project and the collective-intelligence idea behind it.',
    url: 'https://www.linkedin.com/pulse/oxynet-collective-intelligence-approach-test-andrea-zignoli/',
  },
  {
    type: 'blog',
    title: 'AI applied to cardiopulmonary exercise test data',
    description:
      'Why accurate models rarely reach clinical practice (the AI chasm), and what that means for explaining automatic threshold detection to clinicians.',
    url: 'https://andreazignoli.github.io/blog-post-5/',
  },
  {
    type: 'medium',
    title: 'Automatic Interpretation of CPET with Deep Learning',
    description:
      'A step-by-step guide to automatic CPET inference with the pyoxynet package.',
    url: 'https://medium.com/@andrea.zignoli/automatic-interpretation-of-cardiopulmonary-exercise-tests-with-deep-learning-2c9b3920ad51',
  },
  {
    type: 'medium',
    title: 'Generating Realistic CPET Data with Python',
    description:
      'How to generate synthetic CPET tests with the conditional GAN in pyoxynet.',
    url: 'https://medium.com/@andrea.zignoli/automatic-generation-of-cardiopulmonary-exercise-tests-with-deep-learning-d1f2cab4e765',
  },
]
