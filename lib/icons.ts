// Maps a technology name to a Devicon slug (https://devicon.dev). Admin can override per skill with the "icon" field.
const ALIAS: Record<string, string> = {
  'next.js': 'nextjs', 'nextjs': 'nextjs', 'node.js': 'nodejs', 'node': 'nodejs', 'express.js': 'express', 'express': 'express',
  'tailwind css': 'tailwindcss', 'tailwind': 'tailwindcss', 'c++': 'cplusplus', 'c#': 'csharp', 'html': 'html5', 'css': 'css3',
  'postgres': 'postgresql', 'vue': 'vuejs', 'vue.js': 'vuejs', 'mongo': 'mongodb', 'nest.js': 'nestjs', 'shell': 'bash',
  'scss': 'sass', 'dockerfile': 'docker', 'jupyter notebook': 'jupyter', 'react.js': 'react', 'reactjs': 'react',
  'socket.io': 'socketio', 'objective-c': 'objectivec', 'vue 3': 'vuejs',
};

// icons that are black and would vanish on a dark background
export const INVERT = new Set(['nextjs', 'express', 'github', 'vercel', 'prisma', 'rust', 'bash', 'flask', 'socketio']);

export const iconSlug = (name: string) => {
  const k = name.trim().toLowerCase();
  return ALIAS[k] ?? k.replace(/[^a-z0-9]/g, '');
};

const COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c', Python: '#3572A5', Java: '#b07219',
  'C++': '#f34b7d', C: '#999999', 'C#': '#178600', PHP: '#4F5D95', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  Shell: '#89e051', Dart: '#00B4AB', Kotlin: '#A97BFF', Swift: '#F05138', Vue: '#41b883', SCSS: '#c6538c', Dockerfile: '#384d54',
};
export const langColor = (name: string) => {
  if (COLORS[name]) return COLORS[name];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h} 60% 55%)`;
};