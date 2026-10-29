// Presentation-only overrides: the published packs retain their own contracts.
export function documentTheme(tokens, dark) {
  return {
    ...tokens,
    ...(dark
      ? {
          paper: '#13171D',
          bg: '#13171D',
          page: '#13171D',
          panel: '#191E26',
          card: '#191E26',
          ink: '#EBEFF5',
          muted: '#A0ACBB',
          subtle: '#78879A',
          hairline: '#303945',
          grid: '#252E39',
          brand: '#8FB5E0',
          accent: '#8FB5E0',
          other: '#526174',
          categorical: ['#8FB5E0', '#D1DBE7', '#9C97C5', '#657C99', '#526174'],
        }
      : {
          paper: '#F5F7FA',
          bg: '#F5F7FA',
          page: '#EDF1F5',
          panel: '#FFFFFF',
          card: '#FFFFFF',
          ink: '#1C2735',
          muted: '#5D6B7C',
          subtle: '#7C8999',
          hairline: '#D5DDE6',
          grid: '#E4E9F0',
          brand: '#3D648E',
          accent: '#3D648E',
          other: '#B7C2CF',
          categorical: ['#3D648E', '#293B51', '#827DAB', '#859BB5', '#B7C2CF'],
        }),
  };
}
