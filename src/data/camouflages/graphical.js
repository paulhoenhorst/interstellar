const multiplayer = [
  'Blue Tones',
  'Deconstructed',
  'Fractal Dirt',
  'Granite Pass',
  'Heat Map',
  'Orange Tones',
  'Razor Feather',
  'Shattered Rock',
  'Omnigenesis',
  'At Ease'
]

const zombies = [
  'Astray',
  'Obsession',
  'Splintered',
  'Subterranean',
  'Typhoon',
  'Unmarked Grave',
  'Wayward',
  'Wyvern',
  'Neuronic',
  'Apocalyptic',
]

const camouflages = [...multiplayer, ...zombies].sort((a, b) => a.localeCompare(b))

export default camouflages.map((camouflage) => ({
  category: 'Graphical',
  name: camouflage,
  multiplayer: multiplayer.includes(camouflage),
  zombies: zombies.includes(camouflage),
}))
