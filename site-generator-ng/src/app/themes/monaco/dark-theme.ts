import * as monaco from 'monaco-editor';

export const darkTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark', // Base theme, can be 'vs', 'vs-dark', or 'hc-black'
  inherit: true, // Inherit from base theme
  rules: [
    { token: '', foreground: 'FFFFFF', background: 'red' }, // Default foreground and background
    // Define additional rules for syntax coloring
    // Example: { token: 'comment', foreground: '629755' }
  ],
  colors: {
    'editor.background': '#1E1E1E', // Editor background color
    'editor.foreground': '#FFFFFF', // Editor default foreground color
    // Define additional colors for editor components
    // Example: 'editorCursor.foreground': '#8B0000'
  }
};

