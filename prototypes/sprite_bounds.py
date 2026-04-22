"""sprite bounding box checks."""

AUCTIONEER = {'w': 32, 'h': 48, 'frames': 10}


def fits(spec, canvas):
    return spec['w'] <= canvas['w'] and spec['h'] <= canvas['h']
