import { PlasmicCanvasHost, registerComponent } from '@plasmicapp/host';
import LivingBackground from './LivingBackground.jsx';

registerComponent(LivingBackground, {
  name: 'LivingBackground',
  importPath: './LivingBackground.jsx',
  isDefaultExport: true,
  props: {
    isPlaying: { type: 'boolean', defaultValue: true },
    speed: { type: 'number', defaultValue: 1 },
    colorA: { type: 'string', defaultValue: '#1a1a2e' },
    colorB: { type: 'string', defaultValue: '#533483' },
  },
  defaultStyles: {
    width: '100%',
    height: '100%',
    minHeight: '200px',
  },
});

export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}