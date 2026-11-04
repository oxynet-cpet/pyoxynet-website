import type { CodeExample } from '@/types'

export const CODE_EXAMPLES = {
  install_pip: {
    lang: 'sh',
    filename: 'terminal',
    code: 'pip install pyoxynet',
  },
  install_git: {
    lang: 'sh',
    filename: 'terminal',
    code: 'pip install git+https://github.com/oxynet-cpet/pyoxynet.git#subdirectory=pyoxynet',
  },
  basic_usage: {
    lang: 'python',
    filename: 'basic_usage.py',
    code: `import pyoxynet

# The bundled example test, through the default model (the CNN)
out_df, thresholds = pyoxynet.test_pyoxynet(plot=True)
print(thresholds['VT1'], thresholds['VT2'])

# Your own test: columns time, VO2_I, VCO2_I, VE_I, PetO2_I, PetCO2_I
# out_df, thresholds = pyoxynet.test_pyoxynet(input_df=df, model='LSTM')`,
  },
  generation: {
    lang: 'python',
    filename: 'generate_cpet.py',
    code: `import pyoxynet

# The conditional GAN generator
generator = pyoxynet.load_generator()

# A synthetic ramp test, and the thresholds it was generated with
df, info = pyoxynet.generate_CPET(generator, plot=True)
print(info['VT1'], info['VT2'])

# The models' thresholds on it
out_df, thresholds = pyoxynet.test_pyoxynet(input_df=df)`,
  },
} satisfies Record<string, CodeExample>
