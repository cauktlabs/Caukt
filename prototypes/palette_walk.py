"""palette enumeration walk."""

PALETTE = {
    'bg': '#1A2E4A',
    'text': '#F5F5F0',
    'cyan': '#5BC0EB',
    'brass': '#D4A943',
    'red': '#E63946',
    'green': '#06A77D',
}


def active_outline():
    return pair('cyan', 'bg')


def pair(a, b):
    return (PALETTE[a], PALETTE[b])
