"""bell rhythm timing prototype."""

def opener_gaps():
    return [180, 0]


def night_volume(hour, base=1.0):
    return base * 0.8 if hour >= 22 or hour < 5 else base


def missed_clank():
    return 'clank-soft'
