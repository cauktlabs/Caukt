"""price decay simulator."""

def price_curve(start, floor, steps):
    span = start - floor
    return [start - span * i / steps for i in range(steps + 1)]


def add_jitter(values, amp, rng):
    return [v + rng.uniform(-amp, amp) for v in values]


def linear_tick(value, drop):
    return max(value - drop, 0)


def tick_window(bps, ms_per_tick):
    return [i * ms_per_tick for i in range(bps)]


def exp_decay(start, floor, k, t):
    gap = start - floor
    return floor + gap * pow(2.718281828, -k * t)
