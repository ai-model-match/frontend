/*
Import all assets to be used as components.
We can apply style of SVGs
*/
export const assets = import.meta.glob('../assets/*.svg', {
  eager: true,
  import: 'ReactComponent',
}) as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>;
