"""auctioneer countdown voice timing."""

WORDS = ['hai', 'san', 'ni', 'ichi']


def pitch_ladder(base=440):
    return [base, base * 9/8, base * 5/4, base * 4/3]


def rhythm(count, step_ms=600):
    return [i * step_ms for i in range(count)]
