const multiplayer = [
  'Fritillary',
  'Menelaus Blue',
  'Monarch',
  'Oakleaf',
  'Orange Sulphur',
  'Red Admiral',
]

const zombies = ['Chaos', 'Death Form', 'Decrepit', 'Grief Manifest', 'Petrified', 'Toxic Spots']

const camouflages = [...multiplayer, ...zombies].sort((a, b) => a.localeCompare(b))

export default camouflages.map((camouflage) => ({
  category: 'Butterfly',
  name: camouflage,
}))
